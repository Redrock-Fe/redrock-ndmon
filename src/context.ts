import { ChildProcessWithoutNullStreams } from "child_process";
import { BuildResult } from "esbuild";
import { Cancel } from "watch-ysy";
import { Options } from "./index";

//文件路径=>hashMap
export interface HashMap {
  [key: string]: string | undefined;
}

interface CancelWatch {
  [key: string]: Cancel;
}
export default class Context {
  bundleResult: BuildResult | undefined;
  options: Options;
  cancelWatch: CancelWatch = {};
  saveTimes: number = 0;
  hashMap: HashMap = {};
  childProcessStream: ChildProcessWithoutNullStreams | undefined;
  constructor(options: Options) {
    this.options = options;
  }
}
