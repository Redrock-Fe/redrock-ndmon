import { Command } from "commander";
import { isAbsolute, resolve } from "path";
import fs from "fs";
import { error, normalize } from "./utils";
import { startExecute } from "./execute";
import Context from "./context";

const program = new Command("ndmon");

export interface Options {
  root: string;
  rootPath?: string;
  type?: string; //当前运行为cjs还是esm
  filename?: string;
  outfile?: string;
  context?: Context;
  outDir?: string;
}

program
  .argument(`<path>`)
  .action(async (path) => {
    const root = process.cwd(); //根目录
    const options: Options = {
      root: normalize(root),
    };
    let rootPath;
    //获取根文件路径
    if (isAbsolute(path)) {
      rootPath = path;
      if (!fs.existsSync(path)) {
        error(`未读取到入口文件${path}`);
        return;
      }
    } else {
      rootPath = resolve(root, path);
      if (!fs.existsSync(rootPath)) {
        error(`未读取到入口文件${path}`);
        return;
      }
    }
    options.rootPath = normalize(rootPath);
    await startExecute(rootPath, options);
  })
  .parse();
