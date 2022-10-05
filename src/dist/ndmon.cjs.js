"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve2, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve2(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var src_exports = {};
module.exports = __toCommonJS(src_exports);
var import_commander = require("commander");
var import_path = require("path");
var import_fs = __toESM(require("fs"));
var import_utils = require("./utils");
var import_execute = require("./execute");
const program = new import_commander.Command("ndmon");
program.argument(`<path>`).action((path) => __async(void 0, null, function* () {
  const root = process.cwd();
  const options = {
    root: (0, import_utils.normalize)(root)
  };
  let rootPath;
  if ((0, import_path.isAbsolute)(path)) {
    rootPath = path;
    if (!import_fs.default.existsSync(path)) {
      (0, import_utils.error)(`\u672A\u8BFB\u53D6\u5230\u5165\u53E3\u6587\u4EF6${path}`);
      return;
    }
  } else {
    rootPath = (0, import_path.resolve)(root, path);
    if (!import_fs.default.existsSync(rootPath)) {
      (0, import_utils.error)(`\u672A\u8BFB\u53D6\u5230\u5165\u53E3\u6587\u4EF6${path}`);
      return;
    }
  }
  options.rootPath = (0, import_utils.normalize)(rootPath);
  yield (0, import_execute.startExecute)(rootPath, options);
})).parse();
