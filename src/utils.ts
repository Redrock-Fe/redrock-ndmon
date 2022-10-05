import chalk from "chalk";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { COMMON_JS, MODULE } from "./constants";
export function error(data: string) {
  console.log(`❌ ${chalk.red(data)}`);
}

export function warn(data: string) {
  console.log(`🔊 ${chalk.yellow(data)}`);
}

export function normalize(p: string) {
  return path.posix.normalize(p).replace(/\\/g, "/");
}

export async function readPkg(root: string): Promise<[boolean, string]> {
  try {
    const pkgPath = path.resolve(root, "package.json");
    const result = await fs.promises.readFile(pkgPath, "utf-8");
    let { type } = JSON.parse(result);
    if (!type) type = COMMON_JS;
    else type = MODULE;
    return [true, type];
  } catch (e) {
    warn(`没有读取到当前根目录"${root}"下的package.json文件！ ${e}`);
  }
  return [false, ""];
}

interface HandleErrorOpt {
  args?: any[];
  ctx?: any;
  errorMessage?: string;
}
export function handleErrorWithRun<T>(
  fn: Function,
  opt: HandleErrorOpt = {}
): T | undefined {
  const { args = [], ctx, errorMessage = undefined } = opt;
  let res: T | undefined;
  try {
    res = ctx ? fn.apply(ctx, args) : fn.apply(null, args);
  } catch (e) {
    error(`${errorMessage ? errorMessage + "-" : ""}${e}`);
  }
  return res;
}

export async function handleAsyncErrorWithRun<T>(
  fn: (...args: any[]) => Promise<T>,
  opt: HandleErrorOpt = {}
) {
  const { args = [], ctx, errorMessage = undefined } = opt;
  let res: T | undefined;
  try {
    res = await (ctx ? fn.apply(ctx, args) : fn.apply(null, args));
  } catch (e) {
    error(`${errorMessage ? errorMessage + "-" : ""}${e}`);
  }
  return res;
}

export function getHash(source: string) {
  return crypto.createHash("sha256").update(source).digest("hex");
}

export function Uint8ArrayToString(fileData: Uint8Array) {
  let dataString = "";
  for (var i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i]);
  }

  return dataString;
}

export function fileExist(filePath: string, extensions: string[] = []) {
  const exts = [...new Set([".js", ".ts", ...extensions])];
  const ext = path.extname(filePath);
  //如果有后缀名 /a/a
  if (ext !== "") {
    //直接读取判断即可
    if (fs.existsSync(filePath)) {
      return filePath;
    }
    return false;
  }
  //如果无后缀名
  else {
    for (const e of exts) {
      if (fs.existsSync(filePath + e)) {
        return filePath + e;
      }
    }
    return false;
  }
}
