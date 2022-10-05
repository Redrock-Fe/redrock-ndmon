var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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

// node_modules/commander/lib/error.js
var require_error = __commonJS({
  "node_modules/commander/lib/error.js"(exports) {
    var CommanderError2 = class extends Error {
      constructor(exitCode, code, message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.code = code;
        this.exitCode = exitCode;
        this.nestedError = void 0;
      }
    };
    var InvalidArgumentError2 = class extends CommanderError2 {
      constructor(message) {
        super(1, "commander.invalidArgument", message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
      }
    };
    exports.CommanderError = CommanderError2;
    exports.InvalidArgumentError = InvalidArgumentError2;
  }
});

// node_modules/commander/lib/argument.js
var require_argument = __commonJS({
  "node_modules/commander/lib/argument.js"(exports) {
    var { InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var Argument2 = class {
      constructor(name, description) {
        this.description = description || "";
        this.variadic = false;
        this.parseArg = void 0;
        this.defaultValue = void 0;
        this.defaultValueDescription = void 0;
        this.argChoices = void 0;
        switch (name[0]) {
          case "<":
            this.required = true;
            this._name = name.slice(1, -1);
            break;
          case "[":
            this.required = false;
            this._name = name.slice(1, -1);
            break;
          default:
            this.required = true;
            this._name = name;
            break;
        }
        if (this._name.length > 3 && this._name.slice(-3) === "...") {
          this.variadic = true;
          this._name = this._name.slice(0, -3);
        }
      }
      name() {
        return this._name;
      }
      _concatValue(value, previous) {
        if (previous === this.defaultValue || !Array.isArray(previous)) {
          return [value];
        }
        return previous.concat(value);
      }
      default(value, description) {
        this.defaultValue = value;
        this.defaultValueDescription = description;
        return this;
      }
      argParser(fn) {
        this.parseArg = fn;
        return this;
      }
      choices(values) {
        this.argChoices = values.slice();
        this.parseArg = (arg, previous) => {
          if (!this.argChoices.includes(arg)) {
            throw new InvalidArgumentError2(`Allowed choices are ${this.argChoices.join(", ")}.`);
          }
          if (this.variadic) {
            return this._concatValue(arg, previous);
          }
          return arg;
        };
        return this;
      }
      argRequired() {
        this.required = true;
        return this;
      }
      argOptional() {
        this.required = false;
        return this;
      }
    };
    function humanReadableArgName(arg) {
      const nameOutput = arg.name() + (arg.variadic === true ? "..." : "");
      return arg.required ? "<" + nameOutput + ">" : "[" + nameOutput + "]";
    }
    exports.Argument = Argument2;
    exports.humanReadableArgName = humanReadableArgName;
  }
});

// node_modules/commander/lib/help.js
var require_help = __commonJS({
  "node_modules/commander/lib/help.js"(exports) {
    var { humanReadableArgName } = require_argument();
    var Help2 = class {
      constructor() {
        this.helpWidth = void 0;
        this.sortSubcommands = false;
        this.sortOptions = false;
      }
      visibleCommands(cmd) {
        const visibleCommands = cmd.commands.filter((cmd2) => !cmd2._hidden);
        if (cmd._hasImplicitHelpCommand()) {
          const [, helpName, helpArgs] = cmd._helpCommandnameAndArgs.match(/([^ ]+) *(.*)/);
          const helpCommand = cmd.createCommand(helpName).helpOption(false);
          helpCommand.description(cmd._helpCommandDescription);
          if (helpArgs)
            helpCommand.arguments(helpArgs);
          visibleCommands.push(helpCommand);
        }
        if (this.sortSubcommands) {
          visibleCommands.sort((a, b) => {
            return a.name().localeCompare(b.name());
          });
        }
        return visibleCommands;
      }
      visibleOptions(cmd) {
        const visibleOptions = cmd.options.filter((option) => !option.hidden);
        const showShortHelpFlag = cmd._hasHelpOption && cmd._helpShortFlag && !cmd._findOption(cmd._helpShortFlag);
        const showLongHelpFlag = cmd._hasHelpOption && !cmd._findOption(cmd._helpLongFlag);
        if (showShortHelpFlag || showLongHelpFlag) {
          let helpOption;
          if (!showShortHelpFlag) {
            helpOption = cmd.createOption(cmd._helpLongFlag, cmd._helpDescription);
          } else if (!showLongHelpFlag) {
            helpOption = cmd.createOption(cmd._helpShortFlag, cmd._helpDescription);
          } else {
            helpOption = cmd.createOption(cmd._helpFlags, cmd._helpDescription);
          }
          visibleOptions.push(helpOption);
        }
        if (this.sortOptions) {
          const getSortKey = (option) => {
            return option.short ? option.short.replace(/^-/, "") : option.long.replace(/^--/, "");
          };
          visibleOptions.sort((a, b) => {
            return getSortKey(a).localeCompare(getSortKey(b));
          });
        }
        return visibleOptions;
      }
      visibleArguments(cmd) {
        if (cmd._argsDescription) {
          cmd._args.forEach((argument) => {
            argument.description = argument.description || cmd._argsDescription[argument.name()] || "";
          });
        }
        if (cmd._args.find((argument) => argument.description)) {
          return cmd._args;
        }
        return [];
      }
      subcommandTerm(cmd) {
        const args = cmd._args.map((arg) => humanReadableArgName(arg)).join(" ");
        return cmd._name + (cmd._aliases[0] ? "|" + cmd._aliases[0] : "") + (cmd.options.length ? " [options]" : "") + (args ? " " + args : "");
      }
      optionTerm(option) {
        return option.flags;
      }
      argumentTerm(argument) {
        return argument.name();
      }
      longestSubcommandTermLength(cmd, helper) {
        return helper.visibleCommands(cmd).reduce((max, command) => {
          return Math.max(max, helper.subcommandTerm(command).length);
        }, 0);
      }
      longestOptionTermLength(cmd, helper) {
        return helper.visibleOptions(cmd).reduce((max, option) => {
          return Math.max(max, helper.optionTerm(option).length);
        }, 0);
      }
      longestArgumentTermLength(cmd, helper) {
        return helper.visibleArguments(cmd).reduce((max, argument) => {
          return Math.max(max, helper.argumentTerm(argument).length);
        }, 0);
      }
      commandUsage(cmd) {
        let cmdName = cmd._name;
        if (cmd._aliases[0]) {
          cmdName = cmdName + "|" + cmd._aliases[0];
        }
        let parentCmdNames = "";
        for (let parentCmd = cmd.parent; parentCmd; parentCmd = parentCmd.parent) {
          parentCmdNames = parentCmd.name() + " " + parentCmdNames;
        }
        return parentCmdNames + cmdName + " " + cmd.usage();
      }
      commandDescription(cmd) {
        return cmd.description();
      }
      subcommandDescription(cmd) {
        return cmd.summary() || cmd.description();
      }
      optionDescription(option) {
        const extraInfo = [];
        if (option.argChoices) {
          extraInfo.push(
            `choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`
          );
        }
        if (option.defaultValue !== void 0) {
          const showDefault = option.required || option.optional || option.isBoolean() && typeof option.defaultValue === "boolean";
          if (showDefault) {
            extraInfo.push(`default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`);
          }
        }
        if (option.presetArg !== void 0 && option.optional) {
          extraInfo.push(`preset: ${JSON.stringify(option.presetArg)}`);
        }
        if (option.envVar !== void 0) {
          extraInfo.push(`env: ${option.envVar}`);
        }
        if (extraInfo.length > 0) {
          return `${option.description} (${extraInfo.join(", ")})`;
        }
        return option.description;
      }
      argumentDescription(argument) {
        const extraInfo = [];
        if (argument.argChoices) {
          extraInfo.push(
            `choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`
          );
        }
        if (argument.defaultValue !== void 0) {
          extraInfo.push(`default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`);
        }
        if (extraInfo.length > 0) {
          const extraDescripton = `(${extraInfo.join(", ")})`;
          if (argument.description) {
            return `${argument.description} ${extraDescripton}`;
          }
          return extraDescripton;
        }
        return argument.description;
      }
      formatHelp(cmd, helper) {
        const termWidth = helper.padWidth(cmd, helper);
        const helpWidth = helper.helpWidth || 80;
        const itemIndentWidth = 2;
        const itemSeparatorWidth = 2;
        function formatItem(term, description) {
          if (description) {
            const fullText = `${term.padEnd(termWidth + itemSeparatorWidth)}${description}`;
            return helper.wrap(fullText, helpWidth - itemIndentWidth, termWidth + itemSeparatorWidth);
          }
          return term;
        }
        function formatList(textArray) {
          return textArray.join("\n").replace(/^/gm, " ".repeat(itemIndentWidth));
        }
        let output = [`Usage: ${helper.commandUsage(cmd)}`, ""];
        const commandDescription = helper.commandDescription(cmd);
        if (commandDescription.length > 0) {
          output = output.concat([commandDescription, ""]);
        }
        const argumentList = helper.visibleArguments(cmd).map((argument) => {
          return formatItem(helper.argumentTerm(argument), helper.argumentDescription(argument));
        });
        if (argumentList.length > 0) {
          output = output.concat(["Arguments:", formatList(argumentList), ""]);
        }
        const optionList = helper.visibleOptions(cmd).map((option) => {
          return formatItem(helper.optionTerm(option), helper.optionDescription(option));
        });
        if (optionList.length > 0) {
          output = output.concat(["Options:", formatList(optionList), ""]);
        }
        const commandList = helper.visibleCommands(cmd).map((cmd2) => {
          return formatItem(helper.subcommandTerm(cmd2), helper.subcommandDescription(cmd2));
        });
        if (commandList.length > 0) {
          output = output.concat(["Commands:", formatList(commandList), ""]);
        }
        return output.join("\n");
      }
      padWidth(cmd, helper) {
        return Math.max(
          helper.longestOptionTermLength(cmd, helper),
          helper.longestSubcommandTermLength(cmd, helper),
          helper.longestArgumentTermLength(cmd, helper)
        );
      }
      wrap(str, width, indent, minColumnWidth = 40) {
        if (str.match(/[\n]\s+/))
          return str;
        const columnWidth = width - indent;
        if (columnWidth < minColumnWidth)
          return str;
        const leadingStr = str.slice(0, indent);
        const columnText = str.slice(indent);
        const indentString = " ".repeat(indent);
        const regex = new RegExp(".{1," + (columnWidth - 1) + "}([\\s\u200B]|$)|[^\\s\u200B]+?([\\s\u200B]|$)", "g");
        const lines = columnText.match(regex) || [];
        return leadingStr + lines.map((line, i) => {
          if (line.slice(-1) === "\n") {
            line = line.slice(0, line.length - 1);
          }
          return (i > 0 ? indentString : "") + line.trimRight();
        }).join("\n");
      }
    };
    exports.Help = Help2;
  }
});

// node_modules/commander/lib/option.js
var require_option = __commonJS({
  "node_modules/commander/lib/option.js"(exports) {
    var { InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var Option2 = class {
      constructor(flags, description) {
        this.flags = flags;
        this.description = description || "";
        this.required = flags.includes("<");
        this.optional = flags.includes("[");
        this.variadic = /\w\.\.\.[>\]]$/.test(flags);
        this.mandatory = false;
        const optionFlags = splitOptionFlags(flags);
        this.short = optionFlags.shortFlag;
        this.long = optionFlags.longFlag;
        this.negate = false;
        if (this.long) {
          this.negate = this.long.startsWith("--no-");
        }
        this.defaultValue = void 0;
        this.defaultValueDescription = void 0;
        this.presetArg = void 0;
        this.envVar = void 0;
        this.parseArg = void 0;
        this.hidden = false;
        this.argChoices = void 0;
        this.conflictsWith = [];
        this.implied = void 0;
      }
      default(value, description) {
        this.defaultValue = value;
        this.defaultValueDescription = description;
        return this;
      }
      preset(arg) {
        this.presetArg = arg;
        return this;
      }
      conflicts(names) {
        this.conflictsWith = this.conflictsWith.concat(names);
        return this;
      }
      implies(impliedOptionValues) {
        this.implied = Object.assign(this.implied || {}, impliedOptionValues);
        return this;
      }
      env(name) {
        this.envVar = name;
        return this;
      }
      argParser(fn) {
        this.parseArg = fn;
        return this;
      }
      makeOptionMandatory(mandatory = true) {
        this.mandatory = !!mandatory;
        return this;
      }
      hideHelp(hide = true) {
        this.hidden = !!hide;
        return this;
      }
      _concatValue(value, previous) {
        if (previous === this.defaultValue || !Array.isArray(previous)) {
          return [value];
        }
        return previous.concat(value);
      }
      choices(values) {
        this.argChoices = values.slice();
        this.parseArg = (arg, previous) => {
          if (!this.argChoices.includes(arg)) {
            throw new InvalidArgumentError2(`Allowed choices are ${this.argChoices.join(", ")}.`);
          }
          if (this.variadic) {
            return this._concatValue(arg, previous);
          }
          return arg;
        };
        return this;
      }
      name() {
        if (this.long) {
          return this.long.replace(/^--/, "");
        }
        return this.short.replace(/^-/, "");
      }
      attributeName() {
        return camelcase(this.name().replace(/^no-/, ""));
      }
      is(arg) {
        return this.short === arg || this.long === arg;
      }
      isBoolean() {
        return !this.required && !this.optional && !this.negate;
      }
    };
    var DualOptions = class {
      constructor(options) {
        this.positiveOptions = /* @__PURE__ */ new Map();
        this.negativeOptions = /* @__PURE__ */ new Map();
        this.dualOptions = /* @__PURE__ */ new Set();
        options.forEach((option) => {
          if (option.negate) {
            this.negativeOptions.set(option.attributeName(), option);
          } else {
            this.positiveOptions.set(option.attributeName(), option);
          }
        });
        this.negativeOptions.forEach((value, key) => {
          if (this.positiveOptions.has(key)) {
            this.dualOptions.add(key);
          }
        });
      }
      valueFromOption(value, option) {
        const optionKey = option.attributeName();
        if (!this.dualOptions.has(optionKey))
          return true;
        const preset = this.negativeOptions.get(optionKey).presetArg;
        const negativeValue = preset !== void 0 ? preset : false;
        return option.negate === (negativeValue === value);
      }
    };
    function camelcase(str) {
      return str.split("-").reduce((str2, word) => {
        return str2 + word[0].toUpperCase() + word.slice(1);
      });
    }
    function splitOptionFlags(flags) {
      let shortFlag;
      let longFlag;
      const flagParts = flags.split(/[ |,]+/);
      if (flagParts.length > 1 && !/^[[<]/.test(flagParts[1]))
        shortFlag = flagParts.shift();
      longFlag = flagParts.shift();
      if (!shortFlag && /^-[^-]$/.test(longFlag)) {
        shortFlag = longFlag;
        longFlag = void 0;
      }
      return { shortFlag, longFlag };
    }
    exports.Option = Option2;
    exports.splitOptionFlags = splitOptionFlags;
    exports.DualOptions = DualOptions;
  }
});

// node_modules/commander/lib/suggestSimilar.js
var require_suggestSimilar = __commonJS({
  "node_modules/commander/lib/suggestSimilar.js"(exports) {
    var maxDistance = 3;
    function editDistance(a, b) {
      if (Math.abs(a.length - b.length) > maxDistance)
        return Math.max(a.length, b.length);
      const d = [];
      for (let i = 0; i <= a.length; i++) {
        d[i] = [i];
      }
      for (let j = 0; j <= b.length; j++) {
        d[0][j] = j;
      }
      for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
          let cost = 1;
          if (a[i - 1] === b[j - 1]) {
            cost = 0;
          } else {
            cost = 1;
          }
          d[i][j] = Math.min(
            d[i - 1][j] + 1,
            d[i][j - 1] + 1,
            d[i - 1][j - 1] + cost
          );
          if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
            d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
          }
        }
      }
      return d[a.length][b.length];
    }
    function suggestSimilar(word, candidates) {
      if (!candidates || candidates.length === 0)
        return "";
      candidates = Array.from(new Set(candidates));
      const searchingOptions = word.startsWith("--");
      if (searchingOptions) {
        word = word.slice(2);
        candidates = candidates.map((candidate) => candidate.slice(2));
      }
      let similar = [];
      let bestDistance = maxDistance;
      const minSimilarity = 0.4;
      candidates.forEach((candidate) => {
        if (candidate.length <= 1)
          return;
        const distance = editDistance(word, candidate);
        const length = Math.max(word.length, candidate.length);
        const similarity = (length - distance) / length;
        if (similarity > minSimilarity) {
          if (distance < bestDistance) {
            bestDistance = distance;
            similar = [candidate];
          } else if (distance === bestDistance) {
            similar.push(candidate);
          }
        }
      });
      similar.sort((a, b) => a.localeCompare(b));
      if (searchingOptions) {
        similar = similar.map((candidate) => `--${candidate}`);
      }
      if (similar.length > 1) {
        return `
(Did you mean one of ${similar.join(", ")}?)`;
      }
      if (similar.length === 1) {
        return `
(Did you mean ${similar[0]}?)`;
      }
      return "";
    }
    exports.suggestSimilar = suggestSimilar;
  }
});

// node_modules/commander/lib/command.js
var require_command = __commonJS({
  "node_modules/commander/lib/command.js"(exports) {
    var EventEmitter = __require("events").EventEmitter;
    var childProcess = __require("child_process");
    var path4 = __require("path");
    var fs4 = __require("fs");
    var process3 = __require("process");
    var { Argument: Argument2, humanReadableArgName } = require_argument();
    var { CommanderError: CommanderError2 } = require_error();
    var { Help: Help2 } = require_help();
    var { Option: Option2, splitOptionFlags, DualOptions } = require_option();
    var { suggestSimilar } = require_suggestSimilar();
    var Command2 = class extends EventEmitter {
      constructor(name) {
        super();
        this.commands = [];
        this.options = [];
        this.parent = null;
        this._allowUnknownOption = false;
        this._allowExcessArguments = true;
        this._args = [];
        this.args = [];
        this.rawArgs = [];
        this.processedArgs = [];
        this._scriptPath = null;
        this._name = name || "";
        this._optionValues = {};
        this._optionValueSources = {};
        this._storeOptionsAsProperties = false;
        this._actionHandler = null;
        this._executableHandler = false;
        this._executableFile = null;
        this._executableDir = null;
        this._defaultCommandName = null;
        this._exitCallback = null;
        this._aliases = [];
        this._combineFlagAndOptionalValue = true;
        this._description = "";
        this._summary = "";
        this._argsDescription = void 0;
        this._enablePositionalOptions = false;
        this._passThroughOptions = false;
        this._lifeCycleHooks = {};
        this._showHelpAfterError = false;
        this._showSuggestionAfterError = true;
        this._outputConfiguration = {
          writeOut: (str) => process3.stdout.write(str),
          writeErr: (str) => process3.stderr.write(str),
          getOutHelpWidth: () => process3.stdout.isTTY ? process3.stdout.columns : void 0,
          getErrHelpWidth: () => process3.stderr.isTTY ? process3.stderr.columns : void 0,
          outputError: (str, write) => write(str)
        };
        this._hidden = false;
        this._hasHelpOption = true;
        this._helpFlags = "-h, --help";
        this._helpDescription = "display help for command";
        this._helpShortFlag = "-h";
        this._helpLongFlag = "--help";
        this._addImplicitHelpCommand = void 0;
        this._helpCommandName = "help";
        this._helpCommandnameAndArgs = "help [command]";
        this._helpCommandDescription = "display help for command";
        this._helpConfiguration = {};
      }
      copyInheritedSettings(sourceCommand) {
        this._outputConfiguration = sourceCommand._outputConfiguration;
        this._hasHelpOption = sourceCommand._hasHelpOption;
        this._helpFlags = sourceCommand._helpFlags;
        this._helpDescription = sourceCommand._helpDescription;
        this._helpShortFlag = sourceCommand._helpShortFlag;
        this._helpLongFlag = sourceCommand._helpLongFlag;
        this._helpCommandName = sourceCommand._helpCommandName;
        this._helpCommandnameAndArgs = sourceCommand._helpCommandnameAndArgs;
        this._helpCommandDescription = sourceCommand._helpCommandDescription;
        this._helpConfiguration = sourceCommand._helpConfiguration;
        this._exitCallback = sourceCommand._exitCallback;
        this._storeOptionsAsProperties = sourceCommand._storeOptionsAsProperties;
        this._combineFlagAndOptionalValue = sourceCommand._combineFlagAndOptionalValue;
        this._allowExcessArguments = sourceCommand._allowExcessArguments;
        this._enablePositionalOptions = sourceCommand._enablePositionalOptions;
        this._showHelpAfterError = sourceCommand._showHelpAfterError;
        this._showSuggestionAfterError = sourceCommand._showSuggestionAfterError;
        return this;
      }
      command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
        let desc = actionOptsOrExecDesc;
        let opts = execOpts;
        if (typeof desc === "object" && desc !== null) {
          opts = desc;
          desc = null;
        }
        opts = opts || {};
        const [, name, args] = nameAndArgs.match(/([^ ]+) *(.*)/);
        const cmd = this.createCommand(name);
        if (desc) {
          cmd.description(desc);
          cmd._executableHandler = true;
        }
        if (opts.isDefault)
          this._defaultCommandName = cmd._name;
        cmd._hidden = !!(opts.noHelp || opts.hidden);
        cmd._executableFile = opts.executableFile || null;
        if (args)
          cmd.arguments(args);
        this.commands.push(cmd);
        cmd.parent = this;
        cmd.copyInheritedSettings(this);
        if (desc)
          return this;
        return cmd;
      }
      createCommand(name) {
        return new Command2(name);
      }
      createHelp() {
        return Object.assign(new Help2(), this.configureHelp());
      }
      configureHelp(configuration) {
        if (configuration === void 0)
          return this._helpConfiguration;
        this._helpConfiguration = configuration;
        return this;
      }
      configureOutput(configuration) {
        if (configuration === void 0)
          return this._outputConfiguration;
        Object.assign(this._outputConfiguration, configuration);
        return this;
      }
      showHelpAfterError(displayHelp = true) {
        if (typeof displayHelp !== "string")
          displayHelp = !!displayHelp;
        this._showHelpAfterError = displayHelp;
        return this;
      }
      showSuggestionAfterError(displaySuggestion = true) {
        this._showSuggestionAfterError = !!displaySuggestion;
        return this;
      }
      addCommand(cmd, opts) {
        if (!cmd._name) {
          throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
        }
        opts = opts || {};
        if (opts.isDefault)
          this._defaultCommandName = cmd._name;
        if (opts.noHelp || opts.hidden)
          cmd._hidden = true;
        this.commands.push(cmd);
        cmd.parent = this;
        return this;
      }
      createArgument(name, description) {
        return new Argument2(name, description);
      }
      argument(name, description, fn, defaultValue) {
        const argument = this.createArgument(name, description);
        if (typeof fn === "function") {
          argument.default(defaultValue).argParser(fn);
        } else {
          argument.default(fn);
        }
        this.addArgument(argument);
        return this;
      }
      arguments(names) {
        names.split(/ +/).forEach((detail) => {
          this.argument(detail);
        });
        return this;
      }
      addArgument(argument) {
        const previousArgument = this._args.slice(-1)[0];
        if (previousArgument && previousArgument.variadic) {
          throw new Error(`only the last argument can be variadic '${previousArgument.name()}'`);
        }
        if (argument.required && argument.defaultValue !== void 0 && argument.parseArg === void 0) {
          throw new Error(`a default value for a required argument is never used: '${argument.name()}'`);
        }
        this._args.push(argument);
        return this;
      }
      addHelpCommand(enableOrNameAndArgs, description) {
        if (enableOrNameAndArgs === false) {
          this._addImplicitHelpCommand = false;
        } else {
          this._addImplicitHelpCommand = true;
          if (typeof enableOrNameAndArgs === "string") {
            this._helpCommandName = enableOrNameAndArgs.split(" ")[0];
            this._helpCommandnameAndArgs = enableOrNameAndArgs;
          }
          this._helpCommandDescription = description || this._helpCommandDescription;
        }
        return this;
      }
      _hasImplicitHelpCommand() {
        if (this._addImplicitHelpCommand === void 0) {
          return this.commands.length && !this._actionHandler && !this._findCommand("help");
        }
        return this._addImplicitHelpCommand;
      }
      hook(event, listener) {
        const allowedValues = ["preSubcommand", "preAction", "postAction"];
        if (!allowedValues.includes(event)) {
          throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
        }
        if (this._lifeCycleHooks[event]) {
          this._lifeCycleHooks[event].push(listener);
        } else {
          this._lifeCycleHooks[event] = [listener];
        }
        return this;
      }
      exitOverride(fn) {
        if (fn) {
          this._exitCallback = fn;
        } else {
          this._exitCallback = (err) => {
            if (err.code !== "commander.executeSubCommandAsync") {
              throw err;
            } else {
            }
          };
        }
        return this;
      }
      _exit(exitCode, code, message) {
        if (this._exitCallback) {
          this._exitCallback(new CommanderError2(exitCode, code, message));
        }
        process3.exit(exitCode);
      }
      action(fn) {
        const listener = (args) => {
          const expectedArgsCount = this._args.length;
          const actionArgs = args.slice(0, expectedArgsCount);
          if (this._storeOptionsAsProperties) {
            actionArgs[expectedArgsCount] = this;
          } else {
            actionArgs[expectedArgsCount] = this.opts();
          }
          actionArgs.push(this);
          return fn.apply(this, actionArgs);
        };
        this._actionHandler = listener;
        return this;
      }
      createOption(flags, description) {
        return new Option2(flags, description);
      }
      addOption(option) {
        const oname = option.name();
        const name = option.attributeName();
        if (option.negate) {
          const positiveLongFlag = option.long.replace(/^--no-/, "--");
          if (!this._findOption(positiveLongFlag)) {
            this.setOptionValueWithSource(name, option.defaultValue === void 0 ? true : option.defaultValue, "default");
          }
        } else if (option.defaultValue !== void 0) {
          this.setOptionValueWithSource(name, option.defaultValue, "default");
        }
        this.options.push(option);
        const handleOptionValue = (val, invalidValueMessage, valueSource) => {
          if (val == null && option.presetArg !== void 0) {
            val = option.presetArg;
          }
          const oldValue = this.getOptionValue(name);
          if (val !== null && option.parseArg) {
            try {
              val = option.parseArg(val, oldValue);
            } catch (err) {
              if (err.code === "commander.invalidArgument") {
                const message = `${invalidValueMessage} ${err.message}`;
                this.error(message, { exitCode: err.exitCode, code: err.code });
              }
              throw err;
            }
          } else if (val !== null && option.variadic) {
            val = option._concatValue(val, oldValue);
          }
          if (val == null) {
            if (option.negate) {
              val = false;
            } else if (option.isBoolean() || option.optional) {
              val = true;
            } else {
              val = "";
            }
          }
          this.setOptionValueWithSource(name, val, valueSource);
        };
        this.on("option:" + oname, (val) => {
          const invalidValueMessage = `error: option '${option.flags}' argument '${val}' is invalid.`;
          handleOptionValue(val, invalidValueMessage, "cli");
        });
        if (option.envVar) {
          this.on("optionEnv:" + oname, (val) => {
            const invalidValueMessage = `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`;
            handleOptionValue(val, invalidValueMessage, "env");
          });
        }
        return this;
      }
      _optionEx(config, flags, description, fn, defaultValue) {
        if (typeof flags === "object" && flags instanceof Option2) {
          throw new Error("To add an Option object use addOption() instead of option() or requiredOption()");
        }
        const option = this.createOption(flags, description);
        option.makeOptionMandatory(!!config.mandatory);
        if (typeof fn === "function") {
          option.default(defaultValue).argParser(fn);
        } else if (fn instanceof RegExp) {
          const regex = fn;
          fn = (val, def) => {
            const m = regex.exec(val);
            return m ? m[0] : def;
          };
          option.default(defaultValue).argParser(fn);
        } else {
          option.default(fn);
        }
        return this.addOption(option);
      }
      option(flags, description, fn, defaultValue) {
        return this._optionEx({}, flags, description, fn, defaultValue);
      }
      requiredOption(flags, description, fn, defaultValue) {
        return this._optionEx({ mandatory: true }, flags, description, fn, defaultValue);
      }
      combineFlagAndOptionalValue(combine = true) {
        this._combineFlagAndOptionalValue = !!combine;
        return this;
      }
      allowUnknownOption(allowUnknown = true) {
        this._allowUnknownOption = !!allowUnknown;
        return this;
      }
      allowExcessArguments(allowExcess = true) {
        this._allowExcessArguments = !!allowExcess;
        return this;
      }
      enablePositionalOptions(positional = true) {
        this._enablePositionalOptions = !!positional;
        return this;
      }
      passThroughOptions(passThrough = true) {
        this._passThroughOptions = !!passThrough;
        if (!!this.parent && passThrough && !this.parent._enablePositionalOptions) {
          throw new Error("passThroughOptions can not be used without turning on enablePositionalOptions for parent command(s)");
        }
        return this;
      }
      storeOptionsAsProperties(storeAsProperties = true) {
        this._storeOptionsAsProperties = !!storeAsProperties;
        if (this.options.length) {
          throw new Error("call .storeOptionsAsProperties() before adding options");
        }
        return this;
      }
      getOptionValue(key) {
        if (this._storeOptionsAsProperties) {
          return this[key];
        }
        return this._optionValues[key];
      }
      setOptionValue(key, value) {
        return this.setOptionValueWithSource(key, value, void 0);
      }
      setOptionValueWithSource(key, value, source) {
        if (this._storeOptionsAsProperties) {
          this[key] = value;
        } else {
          this._optionValues[key] = value;
        }
        this._optionValueSources[key] = source;
        return this;
      }
      getOptionValueSource(key) {
        return this._optionValueSources[key];
      }
      _prepareUserArgs(argv, parseOptions) {
        if (argv !== void 0 && !Array.isArray(argv)) {
          throw new Error("first parameter to parse must be array or undefined");
        }
        parseOptions = parseOptions || {};
        if (argv === void 0) {
          argv = process3.argv;
          if (process3.versions && process3.versions.electron) {
            parseOptions.from = "electron";
          }
        }
        this.rawArgs = argv.slice();
        let userArgs;
        switch (parseOptions.from) {
          case void 0:
          case "node":
            this._scriptPath = argv[1];
            userArgs = argv.slice(2);
            break;
          case "electron":
            if (process3.defaultApp) {
              this._scriptPath = argv[1];
              userArgs = argv.slice(2);
            } else {
              userArgs = argv.slice(1);
            }
            break;
          case "user":
            userArgs = argv.slice(0);
            break;
          default:
            throw new Error(`unexpected parse option { from: '${parseOptions.from}' }`);
        }
        if (!this._name && this._scriptPath)
          this.nameFromFilename(this._scriptPath);
        this._name = this._name || "program";
        return userArgs;
      }
      parse(argv, parseOptions) {
        const userArgs = this._prepareUserArgs(argv, parseOptions);
        this._parseCommand([], userArgs);
        return this;
      }
      async parseAsync(argv, parseOptions) {
        const userArgs = this._prepareUserArgs(argv, parseOptions);
        await this._parseCommand([], userArgs);
        return this;
      }
      _executeSubCommand(subcommand, args) {
        args = args.slice();
        let launchWithNode = false;
        const sourceExt = [".js", ".ts", ".tsx", ".mjs", ".cjs"];
        function findFile(baseDir, baseName) {
          const localBin = path4.resolve(baseDir, baseName);
          if (fs4.existsSync(localBin))
            return localBin;
          if (sourceExt.includes(path4.extname(baseName)))
            return void 0;
          const foundExt = sourceExt.find((ext) => fs4.existsSync(`${localBin}${ext}`));
          if (foundExt)
            return `${localBin}${foundExt}`;
          return void 0;
        }
        this._checkForMissingMandatoryOptions();
        this._checkForConflictingOptions();
        let executableFile = subcommand._executableFile || `${this._name}-${subcommand._name}`;
        let executableDir = this._executableDir || "";
        if (this._scriptPath) {
          let resolvedScriptPath;
          try {
            resolvedScriptPath = fs4.realpathSync(this._scriptPath);
          } catch (err) {
            resolvedScriptPath = this._scriptPath;
          }
          executableDir = path4.resolve(path4.dirname(resolvedScriptPath), executableDir);
        }
        if (executableDir) {
          let localFile = findFile(executableDir, executableFile);
          if (!localFile && !subcommand._executableFile && this._scriptPath) {
            const legacyName = path4.basename(this._scriptPath, path4.extname(this._scriptPath));
            if (legacyName !== this._name) {
              localFile = findFile(executableDir, `${legacyName}-${subcommand._name}`);
            }
          }
          executableFile = localFile || executableFile;
        }
        launchWithNode = sourceExt.includes(path4.extname(executableFile));
        let proc;
        if (process3.platform !== "win32") {
          if (launchWithNode) {
            args.unshift(executableFile);
            args = incrementNodeInspectorPort(process3.execArgv).concat(args);
            proc = childProcess.spawn(process3.argv[0], args, { stdio: "inherit" });
          } else {
            proc = childProcess.spawn(executableFile, args, { stdio: "inherit" });
          }
        } else {
          args.unshift(executableFile);
          args = incrementNodeInspectorPort(process3.execArgv).concat(args);
          proc = childProcess.spawn(process3.execPath, args, { stdio: "inherit" });
        }
        if (!proc.killed) {
          const signals = ["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"];
          signals.forEach((signal) => {
            process3.on(signal, () => {
              if (proc.killed === false && proc.exitCode === null) {
                proc.kill(signal);
              }
            });
          });
        }
        const exitCallback = this._exitCallback;
        if (!exitCallback) {
          proc.on("close", process3.exit.bind(process3));
        } else {
          proc.on("close", () => {
            exitCallback(new CommanderError2(process3.exitCode || 0, "commander.executeSubCommandAsync", "(close)"));
          });
        }
        proc.on("error", (err) => {
          if (err.code === "ENOENT") {
            const executableDirMessage = executableDir ? `searched for local subcommand relative to directory '${executableDir}'` : "no directory for search for local subcommand, use .executableDir() to supply a custom directory";
            const executableMissing = `'${executableFile}' does not exist
 - if '${subcommand._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDirMessage}`;
            throw new Error(executableMissing);
          } else if (err.code === "EACCES") {
            throw new Error(`'${executableFile}' not executable`);
          }
          if (!exitCallback) {
            process3.exit(1);
          } else {
            const wrappedError = new CommanderError2(1, "commander.executeSubCommandAsync", "(error)");
            wrappedError.nestedError = err;
            exitCallback(wrappedError);
          }
        });
        this.runningCommand = proc;
      }
      _dispatchSubcommand(commandName, operands, unknown) {
        const subCommand = this._findCommand(commandName);
        if (!subCommand)
          this.help({ error: true });
        let hookResult;
        hookResult = this._chainOrCallSubCommandHook(hookResult, subCommand, "preSubcommand");
        hookResult = this._chainOrCall(hookResult, () => {
          if (subCommand._executableHandler) {
            this._executeSubCommand(subCommand, operands.concat(unknown));
          } else {
            return subCommand._parseCommand(operands, unknown);
          }
        });
        return hookResult;
      }
      _checkNumberOfArguments() {
        this._args.forEach((arg, i) => {
          if (arg.required && this.args[i] == null) {
            this.missingArgument(arg.name());
          }
        });
        if (this._args.length > 0 && this._args[this._args.length - 1].variadic) {
          return;
        }
        if (this.args.length > this._args.length) {
          this._excessArguments(this.args);
        }
      }
      _processArguments() {
        const myParseArg = (argument, value, previous) => {
          let parsedValue = value;
          if (value !== null && argument.parseArg) {
            try {
              parsedValue = argument.parseArg(value, previous);
            } catch (err) {
              if (err.code === "commander.invalidArgument") {
                const message = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'. ${err.message}`;
                this.error(message, { exitCode: err.exitCode, code: err.code });
              }
              throw err;
            }
          }
          return parsedValue;
        };
        this._checkNumberOfArguments();
        const processedArgs = [];
        this._args.forEach((declaredArg, index) => {
          let value = declaredArg.defaultValue;
          if (declaredArg.variadic) {
            if (index < this.args.length) {
              value = this.args.slice(index);
              if (declaredArg.parseArg) {
                value = value.reduce((processed, v) => {
                  return myParseArg(declaredArg, v, processed);
                }, declaredArg.defaultValue);
              }
            } else if (value === void 0) {
              value = [];
            }
          } else if (index < this.args.length) {
            value = this.args[index];
            if (declaredArg.parseArg) {
              value = myParseArg(declaredArg, value, declaredArg.defaultValue);
            }
          }
          processedArgs[index] = value;
        });
        this.processedArgs = processedArgs;
      }
      _chainOrCall(promise, fn) {
        if (promise && promise.then && typeof promise.then === "function") {
          return promise.then(() => fn());
        }
        return fn();
      }
      _chainOrCallHooks(promise, event) {
        let result = promise;
        const hooks = [];
        getCommandAndParents(this).reverse().filter((cmd) => cmd._lifeCycleHooks[event] !== void 0).forEach((hookedCommand) => {
          hookedCommand._lifeCycleHooks[event].forEach((callback) => {
            hooks.push({ hookedCommand, callback });
          });
        });
        if (event === "postAction") {
          hooks.reverse();
        }
        hooks.forEach((hookDetail) => {
          result = this._chainOrCall(result, () => {
            return hookDetail.callback(hookDetail.hookedCommand, this);
          });
        });
        return result;
      }
      _chainOrCallSubCommandHook(promise, subCommand, event) {
        let result = promise;
        if (this._lifeCycleHooks[event] !== void 0) {
          this._lifeCycleHooks[event].forEach((hook) => {
            result = this._chainOrCall(result, () => {
              return hook(this, subCommand);
            });
          });
        }
        return result;
      }
      _parseCommand(operands, unknown) {
        const parsed = this.parseOptions(unknown);
        this._parseOptionsEnv();
        this._parseOptionsImplied();
        operands = operands.concat(parsed.operands);
        unknown = parsed.unknown;
        this.args = operands.concat(unknown);
        if (operands && this._findCommand(operands[0])) {
          return this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
        }
        if (this._hasImplicitHelpCommand() && operands[0] === this._helpCommandName) {
          if (operands.length === 1) {
            this.help();
          }
          return this._dispatchSubcommand(operands[1], [], [this._helpLongFlag]);
        }
        if (this._defaultCommandName) {
          outputHelpIfRequested(this, unknown);
          return this._dispatchSubcommand(this._defaultCommandName, operands, unknown);
        }
        if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) {
          this.help({ error: true });
        }
        outputHelpIfRequested(this, parsed.unknown);
        this._checkForMissingMandatoryOptions();
        this._checkForConflictingOptions();
        const checkForUnknownOptions = () => {
          if (parsed.unknown.length > 0) {
            this.unknownOption(parsed.unknown[0]);
          }
        };
        const commandEvent = `command:${this.name()}`;
        if (this._actionHandler) {
          checkForUnknownOptions();
          this._processArguments();
          let actionResult;
          actionResult = this._chainOrCallHooks(actionResult, "preAction");
          actionResult = this._chainOrCall(actionResult, () => this._actionHandler(this.processedArgs));
          if (this.parent) {
            actionResult = this._chainOrCall(actionResult, () => {
              this.parent.emit(commandEvent, operands, unknown);
            });
          }
          actionResult = this._chainOrCallHooks(actionResult, "postAction");
          return actionResult;
        }
        if (this.parent && this.parent.listenerCount(commandEvent)) {
          checkForUnknownOptions();
          this._processArguments();
          this.parent.emit(commandEvent, operands, unknown);
        } else if (operands.length) {
          if (this._findCommand("*")) {
            return this._dispatchSubcommand("*", operands, unknown);
          }
          if (this.listenerCount("command:*")) {
            this.emit("command:*", operands, unknown);
          } else if (this.commands.length) {
            this.unknownCommand();
          } else {
            checkForUnknownOptions();
            this._processArguments();
          }
        } else if (this.commands.length) {
          checkForUnknownOptions();
          this.help({ error: true });
        } else {
          checkForUnknownOptions();
          this._processArguments();
        }
      }
      _findCommand(name) {
        if (!name)
          return void 0;
        return this.commands.find((cmd) => cmd._name === name || cmd._aliases.includes(name));
      }
      _findOption(arg) {
        return this.options.find((option) => option.is(arg));
      }
      _checkForMissingMandatoryOptions() {
        for (let cmd = this; cmd; cmd = cmd.parent) {
          cmd.options.forEach((anOption) => {
            if (anOption.mandatory && cmd.getOptionValue(anOption.attributeName()) === void 0) {
              cmd.missingMandatoryOptionValue(anOption);
            }
          });
        }
      }
      _checkForConflictingLocalOptions() {
        const definedNonDefaultOptions = this.options.filter(
          (option) => {
            const optionKey = option.attributeName();
            if (this.getOptionValue(optionKey) === void 0) {
              return false;
            }
            return this.getOptionValueSource(optionKey) !== "default";
          }
        );
        const optionsWithConflicting = definedNonDefaultOptions.filter(
          (option) => option.conflictsWith.length > 0
        );
        optionsWithConflicting.forEach((option) => {
          const conflictingAndDefined = definedNonDefaultOptions.find(
            (defined) => option.conflictsWith.includes(defined.attributeName())
          );
          if (conflictingAndDefined) {
            this._conflictingOption(option, conflictingAndDefined);
          }
        });
      }
      _checkForConflictingOptions() {
        for (let cmd = this; cmd; cmd = cmd.parent) {
          cmd._checkForConflictingLocalOptions();
        }
      }
      parseOptions(argv) {
        const operands = [];
        const unknown = [];
        let dest = operands;
        const args = argv.slice();
        function maybeOption(arg) {
          return arg.length > 1 && arg[0] === "-";
        }
        let activeVariadicOption = null;
        while (args.length) {
          const arg = args.shift();
          if (arg === "--") {
            if (dest === unknown)
              dest.push(arg);
            dest.push(...args);
            break;
          }
          if (activeVariadicOption && !maybeOption(arg)) {
            this.emit(`option:${activeVariadicOption.name()}`, arg);
            continue;
          }
          activeVariadicOption = null;
          if (maybeOption(arg)) {
            const option = this._findOption(arg);
            if (option) {
              if (option.required) {
                const value = args.shift();
                if (value === void 0)
                  this.optionMissingArgument(option);
                this.emit(`option:${option.name()}`, value);
              } else if (option.optional) {
                let value = null;
                if (args.length > 0 && !maybeOption(args[0])) {
                  value = args.shift();
                }
                this.emit(`option:${option.name()}`, value);
              } else {
                this.emit(`option:${option.name()}`);
              }
              activeVariadicOption = option.variadic ? option : null;
              continue;
            }
          }
          if (arg.length > 2 && arg[0] === "-" && arg[1] !== "-") {
            const option = this._findOption(`-${arg[1]}`);
            if (option) {
              if (option.required || option.optional && this._combineFlagAndOptionalValue) {
                this.emit(`option:${option.name()}`, arg.slice(2));
              } else {
                this.emit(`option:${option.name()}`);
                args.unshift(`-${arg.slice(2)}`);
              }
              continue;
            }
          }
          if (/^--[^=]+=/.test(arg)) {
            const index = arg.indexOf("=");
            const option = this._findOption(arg.slice(0, index));
            if (option && (option.required || option.optional)) {
              this.emit(`option:${option.name()}`, arg.slice(index + 1));
              continue;
            }
          }
          if (maybeOption(arg)) {
            dest = unknown;
          }
          if ((this._enablePositionalOptions || this._passThroughOptions) && operands.length === 0 && unknown.length === 0) {
            if (this._findCommand(arg)) {
              operands.push(arg);
              if (args.length > 0)
                unknown.push(...args);
              break;
            } else if (arg === this._helpCommandName && this._hasImplicitHelpCommand()) {
              operands.push(arg);
              if (args.length > 0)
                operands.push(...args);
              break;
            } else if (this._defaultCommandName) {
              unknown.push(arg);
              if (args.length > 0)
                unknown.push(...args);
              break;
            }
          }
          if (this._passThroughOptions) {
            dest.push(arg);
            if (args.length > 0)
              dest.push(...args);
            break;
          }
          dest.push(arg);
        }
        return { operands, unknown };
      }
      opts() {
        if (this._storeOptionsAsProperties) {
          const result = {};
          const len = this.options.length;
          for (let i = 0; i < len; i++) {
            const key = this.options[i].attributeName();
            result[key] = key === this._versionOptionName ? this._version : this[key];
          }
          return result;
        }
        return this._optionValues;
      }
      optsWithGlobals() {
        return getCommandAndParents(this).reduce(
          (combinedOptions, cmd) => Object.assign(combinedOptions, cmd.opts()),
          {}
        );
      }
      error(message, errorOptions) {
        this._outputConfiguration.outputError(`${message}
`, this._outputConfiguration.writeErr);
        if (typeof this._showHelpAfterError === "string") {
          this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`);
        } else if (this._showHelpAfterError) {
          this._outputConfiguration.writeErr("\n");
          this.outputHelp({ error: true });
        }
        const config = errorOptions || {};
        const exitCode = config.exitCode || 1;
        const code = config.code || "commander.error";
        this._exit(exitCode, code, message);
      }
      _parseOptionsEnv() {
        this.options.forEach((option) => {
          if (option.envVar && option.envVar in process3.env) {
            const optionKey = option.attributeName();
            if (this.getOptionValue(optionKey) === void 0 || ["default", "config", "env"].includes(this.getOptionValueSource(optionKey))) {
              if (option.required || option.optional) {
                this.emit(`optionEnv:${option.name()}`, process3.env[option.envVar]);
              } else {
                this.emit(`optionEnv:${option.name()}`);
              }
            }
          }
        });
      }
      _parseOptionsImplied() {
        const dualHelper = new DualOptions(this.options);
        const hasCustomOptionValue = (optionKey) => {
          return this.getOptionValue(optionKey) !== void 0 && !["default", "implied"].includes(this.getOptionValueSource(optionKey));
        };
        this.options.filter((option) => option.implied !== void 0 && hasCustomOptionValue(option.attributeName()) && dualHelper.valueFromOption(this.getOptionValue(option.attributeName()), option)).forEach((option) => {
          Object.keys(option.implied).filter((impliedKey) => !hasCustomOptionValue(impliedKey)).forEach((impliedKey) => {
            this.setOptionValueWithSource(impliedKey, option.implied[impliedKey], "implied");
          });
        });
      }
      missingArgument(name) {
        const message = `error: missing required argument '${name}'`;
        this.error(message, { code: "commander.missingArgument" });
      }
      optionMissingArgument(option) {
        const message = `error: option '${option.flags}' argument missing`;
        this.error(message, { code: "commander.optionMissingArgument" });
      }
      missingMandatoryOptionValue(option) {
        const message = `error: required option '${option.flags}' not specified`;
        this.error(message, { code: "commander.missingMandatoryOptionValue" });
      }
      _conflictingOption(option, conflictingOption) {
        const findBestOptionFromValue = (option2) => {
          const optionKey = option2.attributeName();
          const optionValue = this.getOptionValue(optionKey);
          const negativeOption = this.options.find((target) => target.negate && optionKey === target.attributeName());
          const positiveOption = this.options.find((target) => !target.negate && optionKey === target.attributeName());
          if (negativeOption && (negativeOption.presetArg === void 0 && optionValue === false || negativeOption.presetArg !== void 0 && optionValue === negativeOption.presetArg)) {
            return negativeOption;
          }
          return positiveOption || option2;
        };
        const getErrorMessage = (option2) => {
          const bestOption = findBestOptionFromValue(option2);
          const optionKey = bestOption.attributeName();
          const source = this.getOptionValueSource(optionKey);
          if (source === "env") {
            return `environment variable '${bestOption.envVar}'`;
          }
          return `option '${bestOption.flags}'`;
        };
        const message = `error: ${getErrorMessage(option)} cannot be used with ${getErrorMessage(conflictingOption)}`;
        this.error(message, { code: "commander.conflictingOption" });
      }
      unknownOption(flag) {
        if (this._allowUnknownOption)
          return;
        let suggestion = "";
        if (flag.startsWith("--") && this._showSuggestionAfterError) {
          let candidateFlags = [];
          let command = this;
          do {
            const moreFlags = command.createHelp().visibleOptions(command).filter((option) => option.long).map((option) => option.long);
            candidateFlags = candidateFlags.concat(moreFlags);
            command = command.parent;
          } while (command && !command._enablePositionalOptions);
          suggestion = suggestSimilar(flag, candidateFlags);
        }
        const message = `error: unknown option '${flag}'${suggestion}`;
        this.error(message, { code: "commander.unknownOption" });
      }
      _excessArguments(receivedArgs) {
        if (this._allowExcessArguments)
          return;
        const expected = this._args.length;
        const s = expected === 1 ? "" : "s";
        const forSubcommand = this.parent ? ` for '${this.name()}'` : "";
        const message = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
        this.error(message, { code: "commander.excessArguments" });
      }
      unknownCommand() {
        const unknownName = this.args[0];
        let suggestion = "";
        if (this._showSuggestionAfterError) {
          const candidateNames = [];
          this.createHelp().visibleCommands(this).forEach((command) => {
            candidateNames.push(command.name());
            if (command.alias())
              candidateNames.push(command.alias());
          });
          suggestion = suggestSimilar(unknownName, candidateNames);
        }
        const message = `error: unknown command '${unknownName}'${suggestion}`;
        this.error(message, { code: "commander.unknownCommand" });
      }
      version(str, flags, description) {
        if (str === void 0)
          return this._version;
        this._version = str;
        flags = flags || "-V, --version";
        description = description || "output the version number";
        const versionOption = this.createOption(flags, description);
        this._versionOptionName = versionOption.attributeName();
        this.options.push(versionOption);
        this.on("option:" + versionOption.name(), () => {
          this._outputConfiguration.writeOut(`${str}
`);
          this._exit(0, "commander.version", str);
        });
        return this;
      }
      description(str, argsDescription) {
        if (str === void 0 && argsDescription === void 0)
          return this._description;
        this._description = str;
        if (argsDescription) {
          this._argsDescription = argsDescription;
        }
        return this;
      }
      summary(str) {
        if (str === void 0)
          return this._summary;
        this._summary = str;
        return this;
      }
      alias(alias) {
        if (alias === void 0)
          return this._aliases[0];
        let command = this;
        if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) {
          command = this.commands[this.commands.length - 1];
        }
        if (alias === command._name)
          throw new Error("Command alias can't be the same as its name");
        command._aliases.push(alias);
        return this;
      }
      aliases(aliases) {
        if (aliases === void 0)
          return this._aliases;
        aliases.forEach((alias) => this.alias(alias));
        return this;
      }
      usage(str) {
        if (str === void 0) {
          if (this._usage)
            return this._usage;
          const args = this._args.map((arg) => {
            return humanReadableArgName(arg);
          });
          return [].concat(
            this.options.length || this._hasHelpOption ? "[options]" : [],
            this.commands.length ? "[command]" : [],
            this._args.length ? args : []
          ).join(" ");
        }
        this._usage = str;
        return this;
      }
      name(str) {
        if (str === void 0)
          return this._name;
        this._name = str;
        return this;
      }
      nameFromFilename(filename) {
        this._name = path4.basename(filename, path4.extname(filename));
        return this;
      }
      executableDir(path5) {
        if (path5 === void 0)
          return this._executableDir;
        this._executableDir = path5;
        return this;
      }
      helpInformation(contextOptions) {
        const helper = this.createHelp();
        if (helper.helpWidth === void 0) {
          helper.helpWidth = contextOptions && contextOptions.error ? this._outputConfiguration.getErrHelpWidth() : this._outputConfiguration.getOutHelpWidth();
        }
        return helper.formatHelp(this, helper);
      }
      _getHelpContext(contextOptions) {
        contextOptions = contextOptions || {};
        const context = { error: !!contextOptions.error };
        let write;
        if (context.error) {
          write = (arg) => this._outputConfiguration.writeErr(arg);
        } else {
          write = (arg) => this._outputConfiguration.writeOut(arg);
        }
        context.write = contextOptions.write || write;
        context.command = this;
        return context;
      }
      outputHelp(contextOptions) {
        let deprecatedCallback;
        if (typeof contextOptions === "function") {
          deprecatedCallback = contextOptions;
          contextOptions = void 0;
        }
        const context = this._getHelpContext(contextOptions);
        getCommandAndParents(this).reverse().forEach((command) => command.emit("beforeAllHelp", context));
        this.emit("beforeHelp", context);
        let helpInformation = this.helpInformation(context);
        if (deprecatedCallback) {
          helpInformation = deprecatedCallback(helpInformation);
          if (typeof helpInformation !== "string" && !Buffer.isBuffer(helpInformation)) {
            throw new Error("outputHelp callback must return a string or a Buffer");
          }
        }
        context.write(helpInformation);
        this.emit(this._helpLongFlag);
        this.emit("afterHelp", context);
        getCommandAndParents(this).forEach((command) => command.emit("afterAllHelp", context));
      }
      helpOption(flags, description) {
        if (typeof flags === "boolean") {
          this._hasHelpOption = flags;
          return this;
        }
        this._helpFlags = flags || this._helpFlags;
        this._helpDescription = description || this._helpDescription;
        const helpFlags = splitOptionFlags(this._helpFlags);
        this._helpShortFlag = helpFlags.shortFlag;
        this._helpLongFlag = helpFlags.longFlag;
        return this;
      }
      help(contextOptions) {
        this.outputHelp(contextOptions);
        let exitCode = process3.exitCode || 0;
        if (exitCode === 0 && contextOptions && typeof contextOptions !== "function" && contextOptions.error) {
          exitCode = 1;
        }
        this._exit(exitCode, "commander.help", "(outputHelp)");
      }
      addHelpText(position, text) {
        const allowedValues = ["beforeAll", "before", "after", "afterAll"];
        if (!allowedValues.includes(position)) {
          throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
        }
        const helpEvent = `${position}Help`;
        this.on(helpEvent, (context) => {
          let helpStr;
          if (typeof text === "function") {
            helpStr = text({ error: context.error, command: context.command });
          } else {
            helpStr = text;
          }
          if (helpStr) {
            context.write(`${helpStr}
`);
          }
        });
        return this;
      }
    };
    function outputHelpIfRequested(cmd, args) {
      const helpOption = cmd._hasHelpOption && args.find((arg) => arg === cmd._helpLongFlag || arg === cmd._helpShortFlag);
      if (helpOption) {
        cmd.outputHelp();
        cmd._exit(0, "commander.helpDisplayed", "(outputHelp)");
      }
    }
    function incrementNodeInspectorPort(args) {
      return args.map((arg) => {
        if (!arg.startsWith("--inspect")) {
          return arg;
        }
        let debugOption;
        let debugHost = "127.0.0.1";
        let debugPort = "9229";
        let match;
        if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
          debugOption = match[1];
        } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
          debugOption = match[1];
          if (/^\d+$/.test(match[3])) {
            debugPort = match[3];
          } else {
            debugHost = match[3];
          }
        } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
          debugOption = match[1];
          debugHost = match[3];
          debugPort = match[4];
        }
        if (debugOption && debugPort !== "0") {
          return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
        }
        return arg;
      });
    }
    function getCommandAndParents(startCommand) {
      const result = [];
      for (let command = startCommand; command; command = command.parent) {
        result.push(command);
      }
      return result;
    }
    exports.Command = Command2;
  }
});

// node_modules/commander/index.js
var require_commander = __commonJS({
  "node_modules/commander/index.js"(exports, module) {
    var { Argument: Argument2 } = require_argument();
    var { Command: Command2 } = require_command();
    var { CommanderError: CommanderError2, InvalidArgumentError: InvalidArgumentError2 } = require_error();
    var { Help: Help2 } = require_help();
    var { Option: Option2 } = require_option();
    exports = module.exports = new Command2();
    exports.program = exports;
    exports.Argument = Argument2;
    exports.Command = Command2;
    exports.CommanderError = CommanderError2;
    exports.Help = Help2;
    exports.InvalidArgumentError = InvalidArgumentError2;
    exports.InvalidOptionArgumentError = InvalidArgumentError2;
    exports.Option = Option2;
  }
});

// node_modules/watch-ysy/lib/utils/getAbsolutePath.js
var require_getAbsolutePath = __commonJS({
  "node_modules/watch-ysy/lib/utils/getAbsolutePath.js"(exports, module) {
    var { resolve: resolve2, isAbsolute: isAbsolute2, extname } = __require("path");
    function getAbsolutePath(context, path4, extensions = [], isDir = false) {
      let absolutePath;
      if (isAbsolute2(path4)) {
        absolutePath = path4;
      } else {
        absolutePath = resolve2(context, path4);
      }
      if (!isDir) {
        const index = extensions.indexOf(extname(absolutePath));
        absolutePath = index === -1 ? createError(absolutePath) : absolutePath;
      }
      return absolutePath;
    }
    function createError(absolutePath) {
      throw new Error(
        `Can not find file at '${absolutePath}'. Maybe you should add params 'extensions',its default value includes [
    ".js",
    ".vue",
    ".html",
    ".jsx",
    ".css",
    ".ts",
    ".tsx",
    ".json",
    ".xml",
    ".less",
    ".sass"
  ]`
      );
    }
    module.exports = getAbsolutePath;
  }
});

// node_modules/watch-ysy/lib/utils/exists.js
var require_exists = __commonJS({
  "node_modules/watch-ysy/lib/utils/exists.js"(exports, module) {
    var fs4 = __require("fs");
    function exists(filePath) {
      return fs4.existsSync(filePath);
    }
    module.exports = exists;
  }
});

// node_modules/watch-ysy/lib/utils/getHash.js
var require_getHash = __commonJS({
  "node_modules/watch-ysy/lib/utils/getHash.js"(exports, module) {
    var crypto2 = __require("crypto");
    function getHash2(content) {
      const fsHash = crypto2.createHash("md5");
      fsHash.update(content);
      return fsHash.digest("hex");
    }
    module.exports = getHash2;
  }
});

// node_modules/watch-ysy/lib/utils/readFile.js
var require_readFile = __commonJS({
  "node_modules/watch-ysy/lib/utils/readFile.js"(exports, module) {
    var fs4 = __require("fs");
    function readFile(path4, callback) {
      const readStream = fs4.createReadStream(path4);
      const chunks = [];
      readStream.on("data", (chunk) => {
        chunks.push(chunk);
      });
      readStream.on("end", () => {
        const result = Buffer.concat(chunks).toString();
        callback(result, null);
      });
      readStream.on("error", (err) => {
        callback(null, err);
      });
    }
    function readFilePromise(path4) {
      const readStream = fs4.createReadStream(path4);
      const chunks = [];
      readStream.on("data", (chunk) => {
        chunks.push(chunk);
      });
      return new Promise((resolve2, reject) => {
        readStream.on("end", () => {
          const result = Buffer.concat(chunks).toString();
          resolve2(result);
        });
        readStream.on("error", (err) => {
          reject(err);
        });
      });
    }
    module.exports = {
      readFile,
      readFilePromise
    };
  }
});

// node_modules/watch-ysy/lib/utils/checkType.js
var require_checkType = __commonJS({
  "node_modules/watch-ysy/lib/utils/checkType.js"(exports, module) {
    function createCheckTypeFunction(type) {
      return function(value) {
        return value && value.constructor === type;
      };
    }
    var typeArr = [
      "isNumber",
      "isString",
      "isFunction",
      "isBoolean",
      "isArray",
      "isObject"
    ];
    var is = function(typeArr2) {
      return typeArr2.reduce((pre, cur) => {
        pre[cur] = createCheckTypeFunction(
          new Function(`return ${cur.slice(2, cur.length)}`)()
        );
        return pre;
      }, {});
    }(typeArr);
    module.exports = {
      isUndefined(value) {
        return value === void 0;
      },
      isNull(value) {
        return value === Null;
      },
      ...is
    };
  }
});

// node_modules/watch-ysy/lib/utils/index.js
var require_utils = __commonJS({
  "node_modules/watch-ysy/lib/utils/index.js"(exports, module) {
    var getAbsolutePath = require_getAbsolutePath();
    var exists = require_exists();
    var getHash2 = require_getHash();
    var { readFilePromise, readFile } = require_readFile();
    var checkType = require_checkType();
    var utils = {
      getAbsolutePath,
      exists,
      getHash: getHash2,
      readFilePromise,
      readFile,
      ...checkType
    };
    module.exports = utils;
  }
});

// node_modules/watch-ysy/lib/extensions.js
var require_extensions = __commonJS({
  "node_modules/watch-ysy/lib/extensions.js"(exports, module) {
    module.exports = [
      ".js",
      ".vue",
      ".html",
      ".jsx",
      ".css",
      ".ts",
      ".tsx",
      ".json",
      ".xml",
      ".md",
      ".less",
      ".sass"
    ];
  }
});

// node_modules/watch-ysy/lib/FileDetail.js
var require_FileDetail = __commonJS({
  "node_modules/watch-ysy/lib/FileDetail.js"(exports, module) {
    var fs4 = __require("fs");
    var { relative, dirname, extname } = __require("path");
    var FileDetail2 = class {
      constructor(hash, path4, content, type, isContent, isStats) {
        this.type = type;
        this.hash = hash;
        this.absolutePath = path4;
        this.filename = this.getFilename();
        this.extname = extname(this.filename);
        this.relativePath = ".\\" + relative(process.cwd(), this.absolutePath);
        this.stats = this.getStatsSync();
        this.isFile = this.stats.isFile();
        this.isDirectory = this.stats.isDirectory();
        this.size = this.stats.size;
        this.parentPath = dirname(this.absolutePath);
        isContent && (this.content = content);
        !isStats && (this.stats = null);
      }
      getStats(callback) {
        fs4.stat(this.absolutePath, (err, stats) => {
          this.stats = stats;
          callback(err, stats);
        });
      }
      getStatsSync() {
        return fs4.statSync(this.absolutePath);
      }
      getFilename() {
        const pathArr = this.absolutePath.split("\\");
        return pathArr[pathArr.length - 1];
      }
    };
    module.exports = FileDetail2;
  }
});

// node_modules/watch-ysy/lib/valid.js
var require_valid = __commonJS({
  "node_modules/watch-ysy/lib/valid.js"(exports, module) {
    var { isFunction, isString, isObject } = require_utils();
    function createError(functionName, where, shouldBe, get) {
      throw new Error(
        `${functionName} ${where} arguments should be '${shouldBe}' but got '${get}'`
      );
    }
    function validWatchFileOrDirSyncArguments(isFile, ...args) {
      const functionName = isFile ? "watchFileSync" : "watchDirSync";
      if (args[0] && !isString(args[0])) {
        createError(functionName, "first", "string", typeof args[0]);
      }
      if (args[1] && !isFunction(args[1])) {
        createError(functionName, "second", "function", typeof args[1]);
      }
      if (args[2] && !isObject(args[2])) {
        createError(functionName, "third", "object", typeof args[2]);
      }
    }
    function validWatchFileOrDirArguments(isFile, ...args) {
      const functionName = isFile ? "watchFile" : "watchDir";
      if (args[0] && !isString(args[0])) {
        createError(functionName, "first", "string", typeof args[0]);
      }
      if (args[1] && !isFunction(args[1])) {
        createError(functionName, "second", "function", typeof arguments[1]);
      }
      if (args[2] && !isObject(args[2])) {
        createError(functionName, "third", "object", typeof args[2]);
      }
      if (args[3] && !isFunction(args[3])) {
        createError(functionName, "fourth", "function", typeof args[3]);
      }
    }
    module.exports = {
      validWatchFileOrDirSyncArguments,
      validWatchFileOrDirArguments
    };
  }
});

// node_modules/watch-ysy/lib/types.js
var require_types = __commonJS({
  "node_modules/watch-ysy/lib/types.js"(exports, module) {
    module.exports = {
      INCREASED: Symbol.for("INCREASED"),
      REDUCED: Symbol.for("REDUCED"),
      CHANGE: Symbol.for("CHANGE")
    };
  }
});

// node_modules/watch-ysy/lib/watchExist.js
var require_watchExist = __commonJS({
  "node_modules/watch-ysy/lib/watchExist.js"(exports, module) {
    var { getAbsolutePath } = require_utils();
    var { REDUCED: REDUCED2 } = require_types();
    var { stat, existsSync } = __require("fs");
    function watchExist(filePath, deleteChildCallback, deleteTargetCallback, dirPath, options, resultCallback = () => {
    }) {
      const { poll = 10 } = options;
      const absolutePath = getAbsolutePath(process.cwd(), filePath, [], true);
      RoundListening(
        absolutePath,
        1e3 / poll,
        deleteChildCallback,
        deleteTargetCallback,
        dirPath,
        resultCallback
      );
    }
    function RoundListening(absolutePath, eachTime, deleteChildCallback, deleteTargetCallback, dirPath, resultCallback) {
      let next = function() {
        setTimeout(() => {
          stat(absolutePath, (err, stats) => {
            if (err) {
              if (existsSync(dirPath)) {
                return deleteChildCallback({
                  type: REDUCED2,
                  absolutePath
                });
              }
              return deleteTargetCallback();
            }
            next && next();
          });
        }, eachTime);
      };
      next();
      function cancel() {
        next = null;
      }
      resultCallback(cancel);
    }
    module.exports = watchExist;
  }
});

// node_modules/watch-ysy/lib/watchFileSync.js
var require_watchFileSync = __commonJS({
  "node_modules/watch-ysy/lib/watchFileSync.js"(exports, module) {
    var { statSync, readFileSync } = __require("fs");
    var { exists, getAbsolutePath, getHash: getHash2 } = require_utils();
    var _extensions = require_extensions();
    var FileDetail2 = require_FileDetail();
    var { validWatchFileOrDirSyncArguments } = require_valid();
    var { CHANGE: CHANGE2 } = require_types();
    var watchExist = require_watchExist();
    function watchFileSync(filePath, changeCallback2, options = {}) {
      validWatchFileOrDirSyncArguments(true, ...arguments);
      let cancelWatchFile;
      const { extensions = _extensions } = options;
      const context = process.cwd();
      const {
        poll = 10,
        isContent = true,
        isStats = true,
        monitorTimeChange = false
      } = options;
      const absolutePath = getAbsolutePath(context, filePath, extensions);
      const eachTime = 1e3 / poll;
      if (exists(absolutePath)) {
        if (!monitorTimeChange) {
          const finalCallback = function(fileData) {
            const fileDetail = new FileDetail2(
              fileData.hash,
              absolutePath,
              fileData.content,
              CHANGE2,
              isContent,
              isStats
            );
            changeCallback2(fileDetail);
          };
          cancelWatchFile = keepRead(absolutePath, eachTime, finalCallback);
        } else if (monitorTimeChange === true) {
          cancelWatchFile = compareModificationTime(
            { eachTime, isContent, isStats },
            absolutePath,
            changeCallback2
          );
        }
      } else {
        throw new Error(`Can not find file from '${absolutePath}'`);
      }
      return cancelWatchFile;
    }
    function compareModificationTime({ eachTime, isContent, isStats }, absolutePath, changeCallback2) {
      let currentStats = statSync(absolutePath);
      let nextStats;
      const flag = setInterval(() => {
        try {
          nextStats = statSync(absolutePath);
        } catch (err) {
          return;
        }
        if (currentStats.mtimeMs !== nextStats.mtimeMs) {
          const fileDetail = new FileDetail2(
            null,
            absolutePath,
            null,
            CHANGE2,
            isContent,
            isStats
          );
          changeCallback2(fileDetail);
        }
        currentStats = nextStats;
      }, eachTime);
      return function() {
        clearInterval(flag);
      };
    }
    function keepRead(absolutePath, eachTime, changeCallback2) {
      const fileData = [];
      let currentIndex = 0;
      let nextIndex = 1;
      const flag = setInterval(() => {
        const content = readFileSync(absolutePath, "utf-8");
        fileData.push({ hash: getHash2(content), content });
        if (fileData.length >= 2 && fileData[currentIndex++].hash !== fileData[nextIndex++].hash) {
          changeCallback2(fileData[currentIndex]);
        }
      }, eachTime);
      return function() {
        clearInterval(flag);
      };
    }
    module.exports = watchFileSync;
  }
});

// node_modules/watch-ysy/lib/watchFile.js
var require_watchFile = __commonJS({
  "node_modules/watch-ysy/lib/watchFile.js"(exports, module) {
    var { stat } = __require("fs");
    var { exists, getAbsolutePath, readFilePromise } = require_utils();
    var _extensions = require_extensions();
    var { getHash: getHash2 } = require_utils();
    var FileDetail2 = require_FileDetail();
    var { validWatchFileOrDirArguments } = require_valid();
    var { CHANGE: CHANGE2 } = require_types();
    function watchFile(filePath, changeCallback2, options = {}, resultCallback = () => {
    }) {
      validWatchFileOrDirArguments(true, ...arguments);
      const context = process.cwd();
      const {
        poll = 10,
        isContent = false,
        isStats = false,
        monitorTimeChange = false,
        extensions = _extensions
      } = options;
      const absolutePath = getAbsolutePath(context, filePath, extensions);
      const eachTime = 1e3 / poll;
      if (exists(absolutePath)) {
        if (!monitorTimeChange) {
          let read2 = function(absolutePath2) {
            return function() {
              return readFilePromise(absolutePath2);
            };
          };
          var read = read2;
          const finalCallback = function(fileData) {
            const fileDetail = new FileDetail2(
              fileData.hash,
              absolutePath,
              fileData.content,
              CHANGE2,
              isContent,
              isStats
            );
            changeCallback2(fileDetail);
          };
          runPromises(read2(absolutePath), eachTime, finalCallback, resultCallback);
        } else if (monitorTimeChange === true) {
          compareModificationTime(
            { eachTime, isContent, isStats },
            absolutePath,
            changeCallback2,
            resultCallback
          );
        }
      } else {
        throw new Error(`Can not find file from '${absolutePath}'`);
      }
    }
    function compareModificationTime({ eachTime, isContent, isStats }, absolutePath, changeCallback2, resultCallback) {
      let currentStats;
      let nextStats;
      stat(absolutePath, (err, stats) => {
        currentStats = stats;
        next && next();
      });
      let next = function() {
        setTimeout(() => {
          stat(absolutePath, (err, stats) => {
            if (err)
              return;
            nextStats = stats;
            if (currentStats.mtimeMs !== nextStats.mtimeMs) {
              const fileDetail = new FileDetail2(
                null,
                absolutePath,
                null,
                CHANGE2,
                isContent,
                isStats
              );
              changeCallback2(fileDetail);
            }
            currentStats = nextStats;
            next && next();
          });
        }, eachTime);
      };
      function cancel() {
        next = null;
      }
      resultCallback(cancel);
    }
    function runPromises(read, eachTime, changeCallback2, resultCallback) {
      const fileData = [];
      let currentIndex = 0;
      let nextIndex = 1;
      let next = function() {
        const promise = read();
        promise.then((content) => {
          setTimeout(() => {
            fileData.push({ hash: getHash2(content), content });
            if (fileData.length >= 2 && fileData[currentIndex++].hash !== fileData[nextIndex++].hash) {
              changeCallback2(fileData[currentIndex]);
            }
            next && next();
          }, eachTime);
        });
      };
      next();
      function cancel() {
        next = null;
      }
      resultCallback(cancel);
    }
    module.exports = watchFile;
  }
});

// node_modules/watch-ysy/lib/WatchData.js
var require_WatchData = __commonJS({
  "node_modules/watch-ysy/lib/WatchData.js"(exports, module) {
    var WatchFileData = class {
      constructor(filePath, cancelWatch) {
        this.filePath = filePath;
        this.cancelWatch = function(arr, index) {
          cancelWatch();
          arr.splice(index, 1);
        };
      }
    };
    var WatchDirData = class {
      constructor(filePath, cancelWatch) {
        this.filePath = filePath;
        this.cancelWatch = function(arr, index) {
          cancelWatch();
          arr.splice(index, 1);
        };
      }
    };
    module.exports = { WatchFileData, WatchDirData };
  }
});

// node_modules/watch-ysy/lib/utils/findCreateAndRemoveFilePath.js
var require_findCreateAndRemoveFilePath = __commonJS({
  "node_modules/watch-ysy/lib/utils/findCreateAndRemoveFilePath.js"(exports, module) {
    var { INCREASED: INCREASED2, REDUCED: REDUCED2 } = require_types();
    function findCreateAndRemoveFilePath(curDirPath, nextDirPath) {
      const map = {};
      const result = [];
      curDirPath.forEach((c) => {
        if (!map[c]) {
          map[c] = 1;
        }
      });
      nextDirPath.forEach((c) => {
        if (!map[c]) {
          result.push({ type: INCREASED2, path: c });
        } else {
          map[c]++;
        }
      });
      for (const key in map) {
        if (map[key] === 1) {
          result.push({ type: REDUCED2, path: key });
        }
      }
      return result;
    }
    module.exports = findCreateAndRemoveFilePath;
  }
});

// node_modules/watch-ysy/lib/cancelMonitor.js
var require_cancelMonitor = __commonJS({
  "node_modules/watch-ysy/lib/cancelMonitor.js"(exports, module) {
    var { REDUCED: REDUCED2 } = require_types();
    function cancelMonitor(absolutePath, watchDirDataArr, watchFileDataArr, options, next, changeCallback2) {
      const { deep } = options;
      let index;
      if (deep) {
        index = watchDirDataArr.findIndex(
          (value) => value.filePath === absolutePath
        );
      }
      if (index !== -1 && deep === true) {
        watchDirDataArr[index].cancelWatch(watchDirDataArr, index);
      } else {
        index = watchFileDataArr.findIndex(
          (value) => value.filePath === absolutePath
        );
        if (index === -1)
          return next && next();
        watchFileDataArr[index].cancelWatch(watchFileDataArr, index);
      }
      changeCallback2({ type: REDUCED2, absolutePath });
    }
    module.exports = cancelMonitor;
  }
});

// node_modules/watch-ysy/lib/watchDir.js
var require_watchDir = __commonJS({
  "node_modules/watch-ysy/lib/watchDir.js"(exports, module) {
    var { readdir, statSync, stat } = __require("fs");
    var { resolve: resolve2 } = __require("path");
    var { getAbsolutePath, exists } = require_utils();
    var _extensions = require_extensions();
    var watchFile = require_watchFile();
    var watchExist = require_watchExist();
    var { WatchFileData, WatchDirData } = require_WatchData();
    var { validWatchFileOrDirArguments } = require_valid();
    var FileDetail2 = require_FileDetail();
    var findCreateAndRemoveFilePath = require_findCreateAndRemoveFilePath();
    var cancelMonitor = require_cancelMonitor();
    var { INCREASED: INCREASED2, REDUCED: REDUCED2 } = require_types();
    function watchDir(dirPath, changeCallback2, options = {}, resultCallback = () => {
    }, isRoot = true) {
      validWatchFileOrDirArguments(false, ...arguments);
      options.deep = options.deep || false;
      options.extensions = options.extensions || _extensions;
      options.poll = options.poll || 10;
      const { deep, extensions, poll } = options;
      const context = process.cwd();
      const absolutePath = getAbsolutePath(
        context,
        dirPath,
        extensions,
        true
      );
      const dirChildPath = [];
      const watchFileDataArr = [];
      const watchDirDataArr = [];
      let hasFinishCount = 0;
      let _cancelWatchCreateAndRemove;
      let _cancelWatchTarget;
      let _files;
      function cancelWatchDir() {
        [...watchFileDataArr].forEach((watchFileObj, index) => {
          watchFileObj.cancelWatch(watchFileDataArr, index);
        });
        [...watchDirDataArr].forEach((watchDirObj, index) => {
          watchDirObj.cancelWatch(watchDirDataArr, index);
        });
        _cancelWatchCreateAndRemove();
        if (isRoot)
          _cancelWatchTarget();
      }
      const _resultCallback = function(maxCount) {
        if (++hasFinishCount === maxCount) {
          return resultCallback(cancelWatchDir);
        }
      };
      if (exists(absolutePath)) {
        if (isRoot)
          watchExist(
            absolutePath,
            () => {
            },
            () => {
              cancelWatchDir();
              changeCallback2({
                absolutePath,
                message: `The directory in '${absolutePath}' has already been deleted`,
                type: REDUCED2
              });
            },
            absolutePath,
            options,
            (cancel) => _cancelWatchTarget = cancel
          );
        readdir(absolutePath, { encoding: "utf-8" }, (err, files) => {
          _files = files;
          files.forEach((filename) => {
            const childAbsolutePath = resolve2(absolutePath, filename);
            dirChildPath.push(childAbsolutePath);
            if (deep) {
              if (statSync(childAbsolutePath).isDirectory()) {
                watchDir(
                  childAbsolutePath,
                  changeCallback2,
                  options,
                  function(cancel) {
                    watchDirDataArr.push(
                      new WatchDirData(childAbsolutePath, cancel)
                    );
                    _resultCallback(files.length + 1, cancelWatchDir);
                  },
                  false
                );
              } else {
                watchFile(
                  childAbsolutePath,
                  changeCallback2,
                  options,
                  function(cancelWatchFile) {
                    watchFileDataArr.push(
                      new WatchFileData(childAbsolutePath, cancelWatchFile)
                    );
                    _resultCallback(files.length + 1, cancelWatchDir);
                  }
                );
              }
            } else {
              if (statSync(childAbsolutePath).isFile()) {
                watchFile(
                  childAbsolutePath,
                  changeCallback2,
                  options,
                  function(cancelWatchFile) {
                    watchFileDataArr.push(
                      new WatchFileData(childAbsolutePath, cancelWatchFile)
                    );
                    _resultCallback(files.length + 1, cancelWatchDir);
                  }
                );
              } else {
                watchExist(
                  childAbsolutePath,
                  changeCallback2,
                  () => {
                  },
                  absolutePath,
                  options
                );
              }
            }
          });
          _cancelWatchCreateAndRemove = watchFileCreateAndRemove(
            1e3 / poll,
            absolutePath,
            watchFileDataArr,
            watchDirDataArr,
            dirChildPath,
            changeCallback2,
            options
          );
          _resultCallback(_files.length + 1, cancelWatchDir);
        });
      } else {
        throw new Error(`Can not find directory from '${absolutePath}'`);
      }
    }
    function watchFileCreateAndRemove(eachTime, dirPath, watchFileDataArr, watchDirDataArr, currentDirPath, changeCallback2, options) {
      let curDirPath = currentDirPath;
      let nextDirPath;
      let next = function() {
        setTimeout(() => {
          readdir(dirPath, (err, filesName) => {
            if (err)
              return;
            nextDirPath = filesName.map((fileName) => resolve2(dirPath, fileName));
            const createAndRemoveFilesPath = findCreateAndRemoveFilePath(
              curDirPath,
              nextDirPath
            );
            curDirPath = nextDirPath;
            if (createAndRemoveFilesPath.length === 0)
              next && next();
            function push(arr, _class, path4) {
              return function(cancel) {
                arr.push(new _class(path4, cancel));
              };
            }
            createAndRemoveFilesPath.forEach((pathObj) => {
              const absolutePath = pathObj.path;
              stat(absolutePath, (err2, stats) => {
                if (err2 || pathObj.type === REDUCED2) {
                  cancelMonitor(
                    absolutePath,
                    watchDirDataArr,
                    watchFileDataArr,
                    options,
                    next,
                    changeCallback2
                  );
                } else if (pathObj.type === INCREASED2) {
                  if (stats.isDirectory()) {
                    if (options.deep === true) {
                      watchDir(
                        absolutePath,
                        changeCallback2,
                        options,
                        push(watchDirDataArr, WatchDirData, absolutePath),
                        false
                      );
                    } else {
                      watchExist(
                        absolutePath,
                        changeCallback2,
                        () => {
                        },
                        dirPath,
                        options
                      );
                    }
                  } else if (stats.isFile()) {
                    watchFile(
                      absolutePath,
                      changeCallback2,
                      options,
                      push(watchFileDataArr, WatchFileData, absolutePath)
                    );
                  }
                  changeCallback2(
                    new FileDetail2(
                      null,
                      absolutePath,
                      null,
                      INCREASED2,
                      options.isContent,
                      options.isStats
                    )
                  );
                }
                next && next();
              });
            });
          });
        }, eachTime);
      };
      next();
      return function() {
        next = null;
      };
    }
    module.exports = watchDir;
  }
});

// node_modules/watch-ysy/lib/watchDirSync.js
var require_watchDirSync = __commonJS({
  "node_modules/watch-ysy/lib/watchDirSync.js"(exports, module) {
    var { readdirSync, statSync } = __require("fs");
    var { resolve: resolve2 } = __require("path");
    var { getAbsolutePath, exists } = require_utils();
    var _extensions = require_extensions();
    var watchFileSync = require_watchFileSync();
    var { WatchFileData, WatchDirData } = require_WatchData();
    var { validWatchFileOrDirArguments } = require_valid();
    var findCreateAndRemoveFilePath = require_findCreateAndRemoveFilePath();
    var watchExist = require_watchExist();
    var cancelMonitor = require_cancelMonitor();
    var { INCREASED: INCREASED2, REDUCED: REDUCED2 } = require_types();
    var FileDetail2 = require_FileDetail();
    function watchDirSync(dirPath, changeCallback2, options = {}, isRoot = true) {
      validWatchFileOrDirArguments(false, ...arguments);
      options.deep = options.deep || false;
      options.extensions = options.extensions || _extensions;
      options.poll = options.poll || 10;
      const { deep, extensions, poll } = options;
      const context = process.cwd();
      const absolutePath = getAbsolutePath(
        context,
        dirPath,
        extensions,
        true
      );
      const dirChildPath = [];
      const watchFileDataArr = [];
      const watchDirDataArr = [];
      let _cancelWatchFileCreateAndRemove;
      let _cancelWatchTarget;
      function cancelWatchDir() {
        [...watchFileDataArr].forEach((watchFileObj, index) => {
          watchFileObj.cancelWatch(watchFileDataArr, index);
        });
        [...watchDirDataArr].forEach((watchDirObj, index) => {
          watchDirObj.cancelWatch(watchDirDataArr, index);
        });
        _cancelWatchFileCreateAndRemove();
        if (isRoot)
          _cancelWatchTarget();
      }
      if (exists(absolutePath)) {
        if (isRoot)
          watchExist(
            absolutePath,
            () => {
            },
            () => {
              changeCallback2({
                absolutePath,
                message: `The directory in '${absolutePath}' has already been deleted`,
                type: REDUCED2
              });
              cancelWatchDir();
            },
            absolutePath,
            options,
            (cancel) => _cancelWatchTarget = cancel
          );
        const files = readdirSync(absolutePath);
        files.forEach((filename) => {
          const childAbsolutePath = resolve2(absolutePath, filename);
          dirChildPath.push(childAbsolutePath);
          if (deep) {
            if (statSync(childAbsolutePath).isDirectory()) {
              const cancel = watchDirSync(
                childAbsolutePath,
                changeCallback2,
                options,
                false
              );
              watchDirDataArr.push(new WatchDirData(childAbsolutePath, cancel));
            } else {
              const cancel = watchFileSync(
                childAbsolutePath,
                changeCallback2,
                options
              );
              watchFileDataArr.push(new WatchFileData(childAbsolutePath, cancel));
            }
          } else {
            if (statSync(childAbsolutePath).isFile()) {
              const cancel = watchFileSync(
                childAbsolutePath,
                changeCallback2,
                options
              );
              watchFileDataArr.push(new WatchFileData(childAbsolutePath, cancel));
            } else {
              watchExist(
                childAbsolutePath,
                changeCallback2,
                () => {
                },
                absolutePath,
                options
              );
            }
          }
        });
        _cancelWatchFileCreateAndRemove = watchFileCreateAndRemove(
          1e3 / poll,
          absolutePath,
          watchFileDataArr,
          watchDirDataArr,
          dirChildPath,
          changeCallback2,
          options
        );
        return cancelWatchDir;
      } else {
        throw new Error(`Can not find directory from '${absolutePath}'`);
      }
    }
    function watchFileCreateAndRemove(eachTime, dirPath, watchFileDataArr, watchDirDataArr, currentDirPath, changeCallback2, options) {
      let curDirPath = currentDirPath;
      let nextDirPath;
      let next = function() {
        try {
          const filesName = readdirSync(dirPath);
          setTimeout(() => {
            nextDirPath = filesName.map((fileName) => resolve2(dirPath, fileName));
            const createAndRemoveFilesPath = findCreateAndRemoveFilePath(
              curDirPath,
              nextDirPath
            );
            curDirPath = nextDirPath;
            if (createAndRemoveFilesPath.length === 0)
              next && next();
            createAndRemoveFilesPath.forEach((pathObj) => {
              const absolutePath = pathObj.path;
              try {
                const stats = statSync(absolutePath);
                if (pathObj.type === INCREASED2) {
                  if (stats.isDirectory()) {
                    if (options.deep === true) {
                      const cancel = watchDirSync(
                        absolutePath,
                        changeCallback2,
                        options,
                        false
                      );
                      watchDirDataArr.push(new WatchDirData(absolutePath, cancel));
                    } else {
                      watchExist(
                        absolutePath,
                        changeCallback2,
                        () => {
                        },
                        dirPath,
                        options
                      );
                    }
                  } else if (stats.isFile()) {
                    const cancel = watchFileSync(
                      absolutePath,
                      changeCallback2,
                      options
                    );
                    watchFileDataArr.push(new WatchFileData(absolutePath, cancel));
                  }
                  changeCallback2(
                    new FileDetail2(
                      null,
                      absolutePath,
                      null,
                      INCREASED2,
                      options.isContent,
                      options.isStats
                    )
                  );
                } else if (pathObj.type === REDUCED2) {
                  cancelMonitor(
                    absolutePath,
                    watchDirDataArr,
                    watchFileDataArr,
                    options,
                    next,
                    changeCallback2
                  );
                }
              } catch (err) {
                if (err) {
                  cancelMonitor(
                    absolutePath,
                    watchDirDataArr,
                    watchFileDataArr,
                    options,
                    next,
                    changeCallback2
                  );
                }
                next && next();
              }
              next && next();
            });
          }, eachTime);
        } catch (err) {
          if (err)
            return;
        }
      };
      next();
      return function() {
        next = null;
      };
    }
    module.exports = watchDirSync;
  }
});

// node_modules/watch-ysy/lib/watch.js
var require_watch = __commonJS({
  "node_modules/watch-ysy/lib/watch.js"(exports, module) {
    var { isArray, isString, isObject, getAbsolutePath } = require_utils();
    var watchDir = require_watchDir();
    var watchFile = require_watchFile();
    var fs4 = __require("fs");
    function _watch(path4, changeCallback2, options, resultCallback) {
      const absolutePath = getAbsolutePath(process.cwd(), path4, [], true);
      if (fs4.statSync(absolutePath).isDirectory()) {
        watchDir(absolutePath, changeCallback2, options, function(cancel) {
          resultCallback(cancel);
        });
      } else {
        watchFile(path4, changeCallback2, options, function(cancel) {
          resultCallback(cancel);
        });
      }
    }
    function watch2(pathArray, changeCallback2, options = {}, resultCallback = () => {
    }) {
      const allResultCallback = [];
      if (isArray(pathArray)) {
        let cache2 = function() {
          let i = 0;
          function cancelAll() {
            allResultCallback.forEach((cancel) => cancel());
          }
          return function(cancel) {
            allResultCallback.push(cancel);
            if (++i === pathArray.length)
              resultCallback(cancelAll);
          };
        };
        var cache = cache2;
        const _resultCallback = cache2();
        pathArray.forEach((path4) => {
          if (isString(path4)) {
            _watch(path4, changeCallback2, options, _resultCallback);
          } else if (isObject(path4)) {
            _watch(
              path4.path,
              changeCallback2,
              path4.options || options,
              _resultCallback
            );
          } else {
            throw new Error(
              `first arguments should be type of 'Array<string|object>'`
            );
          }
        });
      } else if (isString(pathArray)) {
        _watch(pathArray, changeCallback2, options, resultCallback);
      } else {
        throw new Error(`first arguments should be type of 'Array<string|object>'`);
      }
    }
    module.exports = watch2;
  }
});

// node_modules/watch-ysy/lib/watchSync.js
var require_watchSync = __commonJS({
  "node_modules/watch-ysy/lib/watchSync.js"(exports, module) {
    var { isArray, isString, isObject, getAbsolutePath } = require_utils();
    var watchDirSync = require_watchDirSync();
    var watchFileSync = require_watchFileSync();
    var fs4 = __require("fs");
    function _watchSync(path4, changeCallback2, options = {}) {
      const absolutePath = getAbsolutePath(process.cwd(), path4, [], true);
      let cancel;
      if (fs4.statSync(absolutePath).isDirectory()) {
        cancel = watchDirSync(absolutePath, changeCallback2, options);
      } else {
        cancel = watchFileSync(path4, changeCallback2, options);
      }
      return cancel;
    }
    function watchSync(pathArray, changeCallback2, options, resultCallback) {
      const allResultCallback = [];
      if (isArray(pathArray)) {
        pathArray.forEach((path4) => {
          if (isString(path4)) {
            allResultCallback.push(_watchSync(path4, changeCallback2, options));
          } else if (isObject(path4)) {
            allResultCallback.push(
              _watchSync(path4.path, changeCallback2, path4.options || options)
            );
          } else {
            throw new Error(
              `first arguments should be type of 'Array<string|object>'`
            );
          }
        });
      } else if (isString(pathArray)) {
        allResultCallback.push(_watchSync(pathArray, changeCallback2, options));
      } else {
        throw new Error(`first arguments should be type of 'Array<string|object>'`);
      }
      return () => allResultCallback.forEach((c) => c());
    }
    module.exports = watchSync;
  }
});

// node_modules/watch-ysy/lib/index.js
var require_lib = __commonJS({
  "node_modules/watch-ysy/lib/index.js"(exports, module) {
    var utils = require_utils();
    var watchFileSync = require_watchFileSync();
    var watchFile = require_watchFile();
    var watchDir = require_watchDir();
    var watchDirSync = require_watchDirSync();
    var watch2 = require_watch();
    var watchSync = require_watchSync();
    var types = require_types();
    var watchAPI = {
      ...utils,
      watchFileSync,
      watchFile,
      watchDir,
      watchDirSync,
      watch: watch2,
      watchSync,
      ...types
    };
    module.exports = watchAPI;
  }
});

// node_modules/commander/esm.mjs
var import_index = __toESM(require_commander(), 1);
var {
  program,
  createCommand,
  createArgument,
  createOption,
  CommanderError,
  InvalidArgumentError,
  InvalidOptionArgumentError,
  Command,
  Argument,
  Option,
  Help
} = import_index.default;

// src/index.ts
import { isAbsolute, resolve } from "path";
import fs3 from "fs";

// node_modules/chalk/source/vendor/ansi-styles/index.js
var ANSI_BACKGROUND_OFFSET = 10;
var wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`;
var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
function assembleStyles() {
  const codes = /* @__PURE__ */ new Map();
  const styles2 = {
    modifier: {
      reset: [0, 0],
      bold: [1, 22],
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      overline: [53, 55],
      inverse: [7, 27],
      hidden: [8, 28],
      strikethrough: [9, 29]
    },
    color: {
      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      blackBright: [90, 39],
      redBright: [91, 39],
      greenBright: [92, 39],
      yellowBright: [93, 39],
      blueBright: [94, 39],
      magentaBright: [95, 39],
      cyanBright: [96, 39],
      whiteBright: [97, 39]
    },
    bgColor: {
      bgBlack: [40, 49],
      bgRed: [41, 49],
      bgGreen: [42, 49],
      bgYellow: [43, 49],
      bgBlue: [44, 49],
      bgMagenta: [45, 49],
      bgCyan: [46, 49],
      bgWhite: [47, 49],
      bgBlackBright: [100, 49],
      bgRedBright: [101, 49],
      bgGreenBright: [102, 49],
      bgYellowBright: [103, 49],
      bgBlueBright: [104, 49],
      bgMagentaBright: [105, 49],
      bgCyanBright: [106, 49],
      bgWhiteBright: [107, 49]
    }
  };
  styles2.color.gray = styles2.color.blackBright;
  styles2.bgColor.bgGray = styles2.bgColor.bgBlackBright;
  styles2.color.grey = styles2.color.blackBright;
  styles2.bgColor.bgGrey = styles2.bgColor.bgBlackBright;
  for (const [groupName, group] of Object.entries(styles2)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles2[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      };
      group[styleName] = styles2[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles2, groupName, {
      value: group,
      enumerable: false
    });
  }
  Object.defineProperty(styles2, "codes", {
    value: codes,
    enumerable: false
  });
  styles2.color.close = "\x1B[39m";
  styles2.bgColor.close = "\x1B[49m";
  styles2.color.ansi = wrapAnsi16();
  styles2.color.ansi256 = wrapAnsi256();
  styles2.color.ansi16m = wrapAnsi16m();
  styles2.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles2.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles2.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles2, {
    rgbToAnsi256: {
      value: (red, green, blue) => {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round((red - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
      },
      enumerable: false
    },
    hexToRgb: {
      value: (hex) => {
        const matches = /(?<colorString>[a-f\d]{6}|[a-f\d]{3})/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let { colorString } = matches.groups;
        if (colorString.length === 3) {
          colorString = [...colorString].map((character) => character + character).join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [
          integer >> 16 & 255,
          integer >> 8 & 255,
          integer & 255
        ];
      },
      enumerable: false
    },
    hexToAnsi256: {
      value: (hex) => styles2.rgbToAnsi256(...styles2.hexToRgb(hex)),
      enumerable: false
    },
    ansi256ToAnsi: {
      value: (code) => {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = remainder % 6 / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false
    },
    rgbToAnsi: {
      value: (red, green, blue) => styles2.ansi256ToAnsi(styles2.rgbToAnsi256(red, green, blue)),
      enumerable: false
    },
    hexToAnsi: {
      value: (hex) => styles2.ansi256ToAnsi(styles2.hexToAnsi256(hex)),
      enumerable: false
    }
  });
  return styles2;
}
var ansiStyles = assembleStyles();
var ansi_styles_default = ansiStyles;

// node_modules/chalk/source/vendor/supports-color/index.js
import process2 from "node:process";
import os from "node:os";
import tty from "node:tty";
function hasFlag(flag, argv = process2.argv) {
  const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix + flag);
  const terminatorPosition = argv.indexOf("--");
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
var { env } = process2;
var flagForceColor;
if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
  flagForceColor = 0;
} else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
  flagForceColor = 1;
}
function envForceColor() {
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      return 1;
    }
    if (env.FORCE_COLOR === "false") {
      return 0;
    }
    return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
  }
}
function translateLevel(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== void 0) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if (haveStream && !streamIsTTY && forceColor === void 0) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (process2.platform === "win32") {
    const osRelease = os.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE", "DRONE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (env.TERM_PROGRAM) {
      case "iTerm.app":
        return version >= 3 ? 3 : 2;
      case "Apple_Terminal":
        return 2;
    }
  }
  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
}
function createSupportsColor(stream, options = {}) {
  const level = _supportsColor(stream, {
    streamIsTTY: stream && stream.isTTY,
    ...options
  });
  return translateLevel(level);
}
var supportsColor = {
  stdout: createSupportsColor({ isTTY: tty.isatty(1) }),
  stderr: createSupportsColor({ isTTY: tty.isatty(2) })
};
var supports_color_default = supportsColor;

// node_modules/chalk/source/utilities.js
function stringReplaceAll(string, substring, replacer) {
  let index = string.indexOf(substring);
  if (index === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string[index - 1] === "\r";
    returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
    endIndex = index + 1;
    index = string.indexOf("\n", endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}

// node_modules/chalk/source/index.js
var { stdout: stdoutColor, stderr: stderrColor } = supports_color_default;
var GENERATOR = Symbol("GENERATOR");
var STYLER = Symbol("STYLER");
var IS_EMPTY = Symbol("IS_EMPTY");
var levelMapping = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
];
var styles = /* @__PURE__ */ Object.create(null);
var applyOptions = (object, options = {}) => {
  if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
    throw new Error("The `level` option should be an integer from 0 to 3");
  }
  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object.level = options.level === void 0 ? colorLevel : options.level;
};
var chalkFactory = (options) => {
  const chalk2 = (...strings) => strings.join(" ");
  applyOptions(chalk2, options);
  Object.setPrototypeOf(chalk2, createChalk.prototype);
  return chalk2;
};
function createChalk(options) {
  return chalkFactory(options);
}
Object.setPrototypeOf(createChalk.prototype, Function.prototype);
for (const [styleName, style] of Object.entries(ansi_styles_default)) {
  styles[styleName] = {
    get() {
      const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
      Object.defineProperty(this, styleName, { value: builder });
      return builder;
    }
  };
}
styles.visible = {
  get() {
    const builder = createBuilder(this, this[STYLER], true);
    Object.defineProperty(this, "visible", { value: builder });
    return builder;
  }
};
var getModelAnsi = (model, level, type, ...arguments_) => {
  if (model === "rgb") {
    if (level === "ansi16m") {
      return ansi_styles_default[type].ansi16m(...arguments_);
    }
    if (level === "ansi256") {
      return ansi_styles_default[type].ansi256(ansi_styles_default.rgbToAnsi256(...arguments_));
    }
    return ansi_styles_default[type].ansi(ansi_styles_default.rgbToAnsi(...arguments_));
  }
  if (model === "hex") {
    return getModelAnsi("rgb", level, type, ...ansi_styles_default.hexToRgb(...arguments_));
  }
  return ansi_styles_default[type][model](...arguments_);
};
var usedModels = ["rgb", "hex", "ansi256"];
for (const model of usedModels) {
  styles[model] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "color", ...arguments_), ansi_styles_default.color.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
  const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
  styles[bgModel] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "bgColor", ...arguments_), ansi_styles_default.bgColor.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
}
var proto = Object.defineProperties(() => {
}, {
  ...styles,
  level: {
    enumerable: true,
    get() {
      return this[GENERATOR].level;
    },
    set(level) {
      this[GENERATOR].level = level;
    }
  }
});
var createStyler = (open, close, parent) => {
  let openAll;
  let closeAll;
  if (parent === void 0) {
    openAll = open;
    closeAll = close;
  } else {
    openAll = parent.openAll + open;
    closeAll = close + parent.closeAll;
  }
  return {
    open,
    close,
    openAll,
    closeAll,
    parent
  };
};
var createBuilder = (self, _styler, _isEmpty) => {
  const builder = (...arguments_) => applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
  Object.setPrototypeOf(builder, proto);
  builder[GENERATOR] = self;
  builder[STYLER] = _styler;
  builder[IS_EMPTY] = _isEmpty;
  return builder;
};
var applyStyle = (self, string) => {
  if (self.level <= 0 || !string) {
    return self[IS_EMPTY] ? "" : string;
  }
  let styler = self[STYLER];
  if (styler === void 0) {
    return string;
  }
  const { openAll, closeAll } = styler;
  if (string.includes("\x1B")) {
    while (styler !== void 0) {
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }
  const lfIndex = string.indexOf("\n");
  if (lfIndex !== -1) {
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }
  return openAll + string + closeAll;
};
Object.defineProperties(createChalk.prototype, styles);
var chalk = createChalk();
var chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
var source_default = chalk;

// src/utils.ts
import fs from "fs";
import path from "path";
import crypto from "crypto";

// src/constants.ts
var COMMON_JS = "commonjs";
var MODULE = "module";

// src/utils.ts
function error(data) {
  console.log(`\u274C ${source_default.red(data)}`);
}
function warn(data) {
  console.log(`\u{1F50A} ${source_default.yellow(data)}`);
}
function normalize(p) {
  return path.posix.normalize(p).replace(/\\/g, "/");
}
function readPkg(root) {
  return __async(this, null, function* () {
    try {
      const pkgPath = path.resolve(root, "package.json");
      const result = yield fs.promises.readFile(pkgPath, "utf-8");
      let { type } = JSON.parse(result);
      if (!type)
        type = COMMON_JS;
      else
        type = MODULE;
      return [true, type];
    } catch (e) {
      warn(`\u6CA1\u6709\u8BFB\u53D6\u5230\u5F53\u524D\u6839\u76EE\u5F55"${root}"\u4E0B\u7684package.json\u6587\u4EF6\uFF01 ${e}`);
    }
    return [false, ""];
  });
}
function handleAsyncErrorWithRun(_0) {
  return __async(this, arguments, function* (fn, opt = {}) {
    const { args = [], ctx, errorMessage = void 0 } = opt;
    let res;
    try {
      res = yield ctx ? fn.apply(ctx, args) : fn.apply(null, args);
    } catch (e) {
      error(`${errorMessage ? errorMessage + "-" : ""}${e}`);
    }
    return res;
  });
}
function getHash(source) {
  return crypto.createHash("sha256").update(source).digest("hex");
}
function Uint8ArrayToString(fileData) {
  let dataString = "";
  for (var i = 0; i < fileData.length; i++) {
    dataString += String.fromCharCode(fileData[i]);
  }
  return dataString;
}
function fileExist(filePath, extensions = []) {
  const exts = [.../* @__PURE__ */ new Set([".js", ".ts", ...extensions])];
  const ext = path.extname(filePath);
  if (ext !== "") {
    if (fs.existsSync(filePath)) {
      return filePath;
    }
    return false;
  } else {
    for (const e of exts) {
      if (fs.existsSync(filePath + e)) {
        return filePath + e;
      }
    }
    return false;
  }
}

// src/execute.ts
import path3 from "path";
import fs2 from "fs";
import { build } from "esbuild";

// src/plugins/watchPlugin.ts
import path2 from "path";

// src/watch.ts
var import_watch_ysy = __toESM(require_lib());
function watcher(path4, context) {
  if (context.cancelWatch[path4])
    return;
  (0, import_watch_ysy.watch)(
    [path4],
    wrapChangeCallback(context, path4),
    { monitorTimeChange: true, poll: 5 },
    (cancel) => {
      if (cancel && typeof cancel === "function") {
        context.cancelWatch[path4] = cancel;
      }
    }
  );
}
function wrapChangeCallback(context, path4) {
  return function(detail) {
    changeCallback(detail, context, path4);
  };
}
function changeCallback(detail, context, path4) {
  const { type } = detail;
  switch (type) {
    case import_watch_ysy.CHANGE:
      console.log(
        source_default.green(
          `\u{1F61A} \u76D1\u542C\u5230\u6587\u4EF6${source_default.blue(`"${path4}"`)}\u53D8\u5316,\u6B63\u5728\u91CD\u542F\u8FDB\u7A0B...`
        )
      );
      if (context.childProcessStream && !context.childProcessStream.killed) {
        context.childProcessStream.kill();
      }
      bundle(context.options).then(() => {
        return setHash(context.options.outfile, context);
      }).then(() => {
        nodeBundleFile(context.options);
        console.log(
          source_default.green(
            `\u{1F61A} \u76D1\u542C\u5230\u6587\u4EF6${source_default.blue(`"${path4}"`)}\u53D8\u5316,\u91CD\u542F\u8FDB\u7A0B\u6210\u529F...`
          )
        );
      });
      break;
    case import_watch_ysy.REDUCED:
      if (context.cancelWatch[path4]) {
        delete context.cancelWatch[path4];
      }
      break;
    case import_watch_ysy.INCREASED:
      break;
    default:
      break;
  }
}

// src/plugins/watchPlugin.ts
function watchPlugin(context) {
  return {
    name: "esbuild:watch-plugin",
    setup(build2) {
      build2.onResolve(
        {
          filter: /^(\.\/|\.\.\/)/
        },
        ({ path: importee, importer }) => {
          const watchPath = path2.resolve(path2.dirname(importer), importee);
          let p = fileExist(watchPath);
          if (p === false) {
            if (!watchPath.includes("node_modules")) {
              error(`watch:\u672A\u627E\u5230\u6587\u4EF6${importee}`);
            }
          } else if (!watchPath.includes("node_modules")) {
            watcher(normalize(p), context);
          }
          return {
            namespace: "watch"
          };
        }
      );
    }
  };
}

// src/execute.ts
import { spawn } from "child_process";

// src/context.ts
var Context = class {
  constructor(options) {
    this.cancelWatch = {};
    this.saveTimes = 0;
    this.hashMap = {};
    this.options = options;
  }
};

// src/execute.ts
function startExecute(rootPath, options) {
  return __async(this, null, function* () {
    console.log("\u{1F600} " + source_default.green("\u5F00\u59CB\u542F\u52A8..."));
    const { root } = options;
    const context = new Context(options);
    options.context = context;
    options.filename = path3.basename(options.rootPath);
    const [isExistPkg, type] = yield readPkg(root);
    if (isExistPkg) {
      options.type = type;
    }
    const outfile = normalize(
      fs2.existsSync(path3.resolve(root, "node_modules")) ? path3.resolve(root, `node_modules/.ndmon/${options.filename}`) : path3.resolve(root, `.ndmon/${options.filename}`)
    );
    const outDir = normalize(path3.dirname(outfile));
    options.outDir = outDir;
    options.outfile = outfile.endsWith(".ts") ? outfile.replace(/.ts$/, ".js") : outfile;
    yield createBundleDir(outDir);
    yield bundle(options);
    yield setHash(options.outfile, context);
    console.log(source_default.green(`\u{1F600} \u542F\u52A8\u6210\u529F,\u5F00\u542F\u76D1\u542C...`));
    nodeBundleFile(options);
  });
}
function createBundleDir(outDir) {
  return __async(this, null, function* () {
    if (!fs2.existsSync(outDir)) {
      yield fs2.promises.mkdir(outDir);
    }
  });
}
function setHash(outfile, context) {
  return __async(this, null, function* () {
    const res = yield handleAsyncErrorWithRun(function() {
      return __async(this, null, function* () {
        const source = context.bundleResult ? Uint8ArrayToString(context.bundleResult.outputFiles[0].contents) : "";
        const hash = getHash(source);
        if (context.hashMap[outfile] !== hash) {
          context.hashMap[outfile] = hash;
          yield fs2.promises.writeFile(outfile, source);
          return true;
        }
        return false;
      });
    });
    if (res === void 0) {
      return false;
    }
    return res;
  });
}
function bundle(options) {
  return __async(this, null, function* () {
    const { rootPath, type, outfile } = options;
    let buildResult;
    watcher(rootPath, options.context);
    try {
      buildResult = yield build({
        entryPoints: [rootPath],
        platform: "node",
        bundle: true,
        format: type === COMMON_JS ? "cjs" : "esm",
        outfile,
        write: false,
        plugins: [watchPlugin(options.context)]
      });
    } catch (e) {
      error(`\u6253\u5305\u9519\u8BEF:${e}`);
    }
    options.context.bundleResult = buildResult;
    return buildResult;
  });
}
function nodeBundleFile(options) {
  const stream = spawn(`node`, [normalize(options.outfile)], {
    cwd: process.cwd()
  });
  options.context.childProcessStream = stream;
  stream.stderr.on("data", (chunk) => {
    error(`\u5B50\u8FDB\u7A0B\u9519\u8BEF:${chunk.toString()}`);
  });
  stream.stdout.on("data", (chunk) => {
    console.log(chunk.toString());
  });
  stream.on("exit", function(code, signal) {
    if (code) {
    } else if (signal) {
      console.log("\u{1F60F} " + source_default.blue(`\u6587\u4EF6\u6539\u53D8,\u5B50\u8FDB\u7A0B\u9000\u51FA...`));
    } else {
      const cancelWatch = options.context.cancelWatch;
      Object.keys(cancelWatch).forEach((key) => {
        cancelWatch[key]();
      });
    }
    options.context.childProcessStream = void 0;
  });
  stream.on("error", function(err) {
    error(err.message);
    err.stack && error(err.stack);
    options.context.childProcessStream = void 0;
  });
  return;
}

// src/index.ts
var program2 = new Command("ndmon");
program2.argument(`<path>`).action((path4) => __async(void 0, null, function* () {
  const root = process.cwd();
  const options = {
    root: normalize(root)
  };
  let rootPath;
  if (isAbsolute(path4)) {
    rootPath = path4;
    if (!fs3.existsSync(path4)) {
      error(`\u672A\u8BFB\u53D6\u5230\u5165\u53E3\u6587\u4EF6${path4}`);
      return;
    }
  } else {
    rootPath = resolve(root, path4);
    if (!fs3.existsSync(rootPath)) {
      error(`\u672A\u8BFB\u53D6\u5230\u5165\u53E3\u6587\u4EF6${path4}`);
      return;
    }
  }
  options.rootPath = normalize(rootPath);
  yield startExecute(rootPath, options);
})).parse();
