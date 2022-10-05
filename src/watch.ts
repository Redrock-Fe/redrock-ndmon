import chalk from "chalk";
import { FileDetail, watch, CHANGE, INCREASED, REDUCED } from "watch-ysy";
import Context from "./context";
import { bundle, nodeBundleFile, setHash } from "./execute";

//对任务进行监听,当文件发生改变的时候重新打包文件
//并重新执行文件
export function watcher(path: string, context: Context) {
  //如果已经监听过了则不在进行监听
  if (context.cancelWatch[path]) return;
  watch(
    [path],
    wrapChangeCallback(context, path),
    { monitorTimeChange: true, poll: 5 },
    (cancel) => {
      if (cancel && typeof cancel === "function") {
        context.cancelWatch[path] = cancel;
      }
    }
  );
}

function wrapChangeCallback(context: Context, path: string) {
  return function (detail: FileDetail) {
    changeCallback(detail, context, path);
  };
}

//文件发生变化的时候执行
export function changeCallback(
  detail: FileDetail,
  context: Context,
  path: string
) {
  const { type } = detail;
  switch (type) {
    //文件发生改变
    case CHANGE:
      console.log(
        chalk.green(
          `😚 监听到文件${chalk.blue(`"${path}"`)}变化,正在重启进程...`
        )
      );
      if (context.childProcessStream && !context.childProcessStream.killed) {
        context.childProcessStream.kill();
      }
      //重新进行打包执行等操作
      bundle(context.options)
        .then(() => {
          return setHash(context.options.outfile!, context);
        })
        .then(() => {
          nodeBundleFile(context.options);
          console.log(
            chalk.green(
              `😚 监听到文件${chalk.blue(`"${path}"`)}变化,重启进程成功...`
            )
          );
        });
      break;
    //删除文件
    case REDUCED:
      //删除对应的取消函数
      if (context.cancelWatch[path]) {
        delete context.cancelWatch[path];
      }
      break;
    //增加文件
    case INCREASED:
      break;
    default:
      break;
  }
}
