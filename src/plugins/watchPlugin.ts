import path from "path";
import { Plugin as EsbuildPlugin } from "esbuild";
import Context from "../context";
import { error, fileExist, normalize } from "../utils";
import { watcher } from "../watch";
import chalk from "chalk";

//在执行esbuild打包的时候扫描所有的文件
//对项目内的文件进行监视
export default function watchPlugin(context: Context): EsbuildPlugin {
  return {
    name: "esbuild:watch-plugin",
    setup(build) {
      //拦截非node_modules文件
      build.onResolve(
        {
          //匹配"./ ../"开头的
          filter: /^(\.\/|\.\.\/)/,
        },
        ({ path: importee, importer }) => {
          const watchPath = path.resolve(path.dirname(importer), importee);
          let p = fileExist(watchPath);
          //表示当前文件不存在
          if (p === false) {
            if (!watchPath.includes("node_modules")) {
              error(`watch:未找到文件${importee}`);
            }
          } else if (!watchPath.includes("node_modules")) {
            watcher(normalize(p), context);
          }

          return {
            namespace: "watch",
          };
        }
      );
    },
  };
}
