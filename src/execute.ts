import path from "path";
import fs from "fs";
import { Options } from "./index";
import { build } from "esbuild";
import { watchPlugin } from "./plugins/index";
import {
  error,
  getHash,
  handleAsyncErrorWithRun,
  normalize,
  readPkg,
  Uint8ArrayToString,
} from "./utils";
import { COMMON_JS } from "./constants";
import { spawn } from "child_process";
import Context from "./context";
import chalk from "chalk";
import { watcher } from "./watch";

export async function startExecute(rootPath: string, options: Options) {
  console.log("😀 " + chalk.green("开始启动..."));
  const { root } = options;
  //创建执行上下文
  const context = new Context(options);
  options.context = context;
  options.filename = path.basename(options.rootPath!);
  const [isExistPkg, type] = await readPkg(root!);
  if (isExistPkg) {
    options.type = type;
  }
  const outfile = normalize(
    fs.existsSync(path.resolve(root!, "node_modules"))
      ? path.resolve(root!, `node_modules/.ndmon/${options.filename}`)
      : path.resolve(root!, `.ndmon/${options.filename}`)
  );
  const outDir = normalize(path.dirname(outfile));
  options.outDir = outDir;
  options.outfile = outfile.endsWith(".ts")
    ? outfile.replace(/.ts$/, ".js")
    : outfile;
  await createBundleDir(outDir);
  //打包入口代码(ts=>js)
  await bundle(options);
  await setHash(options.outfile, context);
  console.log(chalk.green(`😀 启动成功,开启监听...`));
  nodeBundleFile(options); //执行打包的代码
}

export async function createBundleDir(outDir: string) {
  if (!fs.existsSync(outDir)) {
    await fs.promises.mkdir(outDir);
  }
}

export async function setHash(outfile: string, context: Context) {
  const res = await handleAsyncErrorWithRun(async function () {
    const source = context.bundleResult
      ? Uint8ArrayToString(context.bundleResult.outputFiles![0].contents)
      : "";
    const hash = getHash(source);
    //最新的hash值与之前的不同,需要写入新的文件
    if (context.hashMap[outfile] !== hash) {
      context.hashMap[outfile] = hash;
      await fs.promises.writeFile(outfile, source);
      return true;
    }
    return false;
  });
  if (res === undefined) {
    return false;
  }
  return res;
}

//打包代码
export async function bundle(options: Options) {
  const { rootPath, type, outfile } = options;
  let buildResult;
  //监听入口文件目录
  watcher(rootPath!, options.context!);
  try {
    buildResult = await build({
      entryPoints: [rootPath!],
      platform: "node",
      bundle: true,
      format: type === COMMON_JS ? "cjs" : "esm",
      outfile,
      write: false,
      plugins: [watchPlugin(options.context!)],
    });
  } catch (e) {
    error(`打包错误:${e}`);
  }
  options.context!.bundleResult = buildResult;
  return buildResult;
}

export function nodeBundleFile(options: Options) {
  //执行打包后的文件
  const stream = spawn(`node`, [normalize(options.outfile!)], {
    cwd: process.cwd(),
  });

  options.context!.childProcessStream = stream;

  //监听输出的错误信息
  stream.stderr.on("data", (chunk) => {
    error(`子进程错误:${chunk.toString()}`);
  });

  //监听子进程输出的信息
  stream.stdout.on("data", (chunk) => {
    console.log(chunk.toString());
  });

  //当开启的进程退出
  stream.on("exit", function (code, signal) {
    //捕获到错误导致子进程停止执行
    if (code) {
      //TODO
    }
    //父进程杀死了子进程
    else if (signal) {
      console.log("😏 " + chalk.blue(`文件改变,子进程退出...`));
    }
    //正常执行完成,关闭监听
    else {
      const cancelWatch = options.context!.cancelWatch;
      Object.keys(cancelWatch).forEach((key) => {
        cancelWatch[key]();
      });
      console.log(chalk.green(`😛 执行完毕...`));
    }
    options.context!.childProcessStream = undefined;
  });

  //无法开启子进程 开启子进程失败等
  //输出错误
  stream.on("error", function (err) {
    error(err.message);
    err.stack && error(err.stack);
    options.context!.childProcessStream = undefined;
  });
  return;
}
