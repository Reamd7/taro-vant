"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var core_1 = require("@babel/core");
var traverse_1 = require("@babel/traverse");
var t = require("@babel/types");
var fs = require("fs");
var path = require("path");
var chalk = require("chalk");
var enhanced_resolve_1 = require("enhanced-resolve");
var class_method_renamer_1 = require("@tarojs/transformer-wx/lib/src/class-method-renamer");
var functional_1 = require("@tarojs/transformer-wx/lib/src/functional");
var DEBUG = false;
function print(message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    DEBUG && console.log.apply(console, __spreadArrays([message], optionalParams));
}
var PathToExternalClasses = new Map();
function buildBabelTransformOptions() {
    var plugins = [
        require("@babel/plugin-proposal-do-expressions"),
        require("@babel/plugin-syntax-export-extensions"),
        require("@babel/plugin-transform-flow-strip-types"),
        [require("babel-plugin-transform-define")["default"], {}],
        class_method_renamer_1.buildVistor()
    ];
    return {
        // filename: exports.transformOptions.sourcePath,
        babelrc: false,
        parserOpts: {
            sourceType: "module",
            presets: [
                "@babel/preset-env",
                "@babel/preset-flow",
                "@babel/preset-react",
                "@babel/preset-typescript"
            ],
            plugins: [
                "jsx",
                // 'flow',
                // 'flowComment',
                "typescript",
                "classProperties",
                // 'trailingFunctionCommas',
                // 'asyncFunctions',
                // 'exponentiationOperator',
                "asyncGenerators",
                "objectRestSpread",
                "decorators-legacy",
                "dynamicImport",
                "doExpressions"
            ]
        },
        plugins: plugins
            .concat(["preval"])
            .concat(process.env.TARO_ENV === "rn" ? [] : functional_1.functionalComponent)
            .concat([
            "minify-dead-code-elimination",
            "minify-guarded-expressions"
        ])
    };
}
var webpackresolve;
var myResolver;
// const notModuleRegExp = /^\.$|^\.[\\\/]|^\.\.$|^\.\.[\/\\]|^\/|^[A-Z]:[\\\/]/i;
// function isNpmPkg(name: string): boolean {
//   // if (/^(\.|\/)/.test(name)) {
//   if (notModuleRegExp.test(name)) {
//     return false
//   }
//   return true
// }
var extList = [".jsx", ".tsx"];
var excludeList = ["@tarojs/taro"];
var cacheMap = excludeList.reduce(function (res, val) {
    res[val] = false;
    return res;
}, {});
module.exports = function (code) {
    var _this = this;
    var callback = this.async();
    if (this.resourceQuery || this.query) {
        // Taro loader 在不注入 query 的情况才是进行 wxtransformer 的。
        return callback(null, code);
    }
    try {
        print(chalk.green("taro-vant externalClassesLoader 处理中: ") +
            this.resourcePath +
            this.resourceQuery);
        var JSXElementMap_1 = new Map();
        var ast_1 = core_1.parseSync(code, buildBabelTransformOptions());
        var handlePath_1 = function (__path__) {
            if (cacheMap[__path__] !== undefined) {
                return Promise.resolve(cacheMap[__path__]);
            }
            // if (excludeList.includes(__path__)) {
            //   // 排除list
            //   return Promise.resolve<false>(cacheMap[__path__] = false);
            // }
            return new Promise(function (resolve, reject) {
                // create a resolver
                if (_this._compiler.options.resolve !== webpackresolve || !myResolver) {
                    myResolver = enhanced_resolve_1.ResolverFactory.createResolver(__assign(__assign({}, (webpackresolve = _this._compiler.options.resolve)), { symlinks: false, fileSystem: new enhanced_resolve_1.CachedInputFileSystem(fs) }));
                }
                myResolver.resolve({}, _this.context, __path__, {}, function (err /*Error*/, filepath /*string*/) {
                    if (err) {
                        reject(err);
                    }
                    else if (filepath && extList.includes(path.extname(filepath))) {
                        resolve((cacheMap[__path__] = filepath));
                    }
                    else {
                        resolve((cacheMap[__path__] = false));
                    }
                    // Do something with the path
                });
            });
            // const alias = this._compiler.options.resolve?.alias || {};
            // for (const key in alias) {
            //   if (Object.prototype.hasOwnProperty.call(alias, key)) {
            //     if (path.isAbsolute(alias[key])) {
            //       const last = (alias[key][alias[key].length - 1]);
            //       if (last === "/" || last === "\\") {
            //         __path__ = __path__.replace(new RegExp(`^${key}/`), alias[key]);
            //       } else {
            //         __path__ = __path__.replace(new RegExp(`^${key}/`), alias[key] + "/");
            //       }
            //     } else {
            //       if (__path__ === key) {
            //         __path__ = path.resolve(process.cwd(), alias[key])
            //       } else {
            //         const last = (alias[key][alias[key].length - 1]);
            //         if (last === "/" || last === "\\") {
            //           __path__ = __path__.replace(new RegExp(`^${key}/`), path.resolve(process.cwd(), alias[key]));
            //         } else {
            //           __path__ = __path__.replace(new RegExp(`^${key}/`), path.resolve(process.cwd(), alias[key]) + "/");
            //         }
            //       }
            //     }
            //   }
            // }
            // if (isNpmPkg(__path__)) {
            //   return path.normalize(require.resolve(__path__));
            // } else {
            //   let tempPath = (path.isAbsolute(__path__)) ? path.normalize(__path__) : path.normalize(path.resolve(path.dirname(resourcePath), __path__));
            //   const ext = path.extname(tempPath);
            //   if (ext === "") {
            //     // 不知道是 dir 还是 缺省 tsx 的
            //     if (existsSync(tempPath)) {
            //       // dir
            //       tempPath = path.normalize(path.resolve(tempPath, "./index"));
            //     }
            //     if (existsSync(tempPath + ".tsx")) {
            //       return tempPath + ".tsx"
            //     } else if (existsSync(tempPath + ".jsx")) {
            //       return tempPath + ".jsx"
            //     }
            //   } else {
            //     if (ext === ".tsx" || ext === ".jsx") {
            //       if (existsSync(tempPath)) {
            //         return tempPath
            //       }
            //     }
            //   }
            // }
            // return ""
        };
        var queue_1 = [];
        traverse_1["default"](ast_1, {
            ImportDeclaration: function (astPath) {
                var node = astPath.node;
                var __path__ = node.source.value;
                var defaultImportKind = node.importKind;
                var specifiers = node.specifiers;
                specifiers.forEach(function (spec) {
                    if (t.isImportNamespaceSpecifier(spec)) {
                        // import * as b from "./dd2";
                    }
                    else if (t.isImportDefaultSpecifier(spec)) {
                        var importKind = defaultImportKind;
                        if (importKind === "type") {
                            // import type aa from "./dd2";
                        }
                        else if (importKind === "value") {
                            // import React from "./dd";
                            var defaultName_1 = spec.local.name;
                            if (/[A-Z]/.test(defaultName_1[0])) {
                                // 首字母大写
                                queue_1.push(handlePath_1(__path__).then(function (res) {
                                    print(__path__, res);
                                    if (res) {
                                        if (PathToExternalClasses.has(res)) {
                                            JSXElementMap_1.set(defaultName_1, PathToExternalClasses.get(res));
                                        }
                                    }
                                }));
                            }
                        }
                        else if (importKind === "typeof") {
                            // TODO
                        }
                        else {
                            // Error
                        }
                    }
                    else if (t.isImportSpecifier(spec)) {
                        // import { bb, default as Rea2ct, type Bas } from "./dd2";
                        var importKind = spec.importKind || defaultImportKind;
                        if (importKind === "type") {
                            // import { type aa } from "./dd2";
                        }
                        else if (importKind === "value") {
                            // import { bb, default as Rea2ct } from "./dd2";
                            var importName = "";
                            if (t.isIdentifier(spec.imported)) {
                                // import { a as bb } from "./dd2"; 中 as 的前面标识符
                                importName = spec.imported.name;
                            }
                            else if (t.isStringLiteral(spec.imported)) {
                                // TODO ? 这是啥
                                importName = spec.imported.value;
                            }
                            // NOTE Taro 的 意义 组件只是 default 导出的。
                            var defaultName_2 = spec.local.name;
                            if (importName === "default" && /[A-Z]/.test(defaultName_2[0])) {
                                queue_1.push(handlePath_1(__path__).then(function (res) {
                                    print(__path__, res);
                                    if (res) {
                                        if (PathToExternalClasses.has(res)) {
                                            JSXElementMap_1.set(defaultName_2, PathToExternalClasses.get(res));
                                        }
                                    }
                                }));
                            }
                        }
                        else if (importKind === "typeof") {
                            // TODO
                        }
                        else {
                            // Error
                        }
                    }
                });
            }
        });
        Promise.all(queue_1)
            .then(function () {
            if (JSXElementMap_1.size) {
                traverse_1["default"](ast_1, {
                    // NOTE：单独针对taro-vant的组件风格进行模式识别，我不太熟悉ast的处理，所以只能有限于taro-vant的组件了
                    JSXOpeningElement: function (astPath) {
                        var node = astPath.node;
                        var JSXIdentifierNode = node.name;
                        if (t.isJSXIdentifier(JSXIdentifierNode)) {
                            var name_1 = JSXIdentifierNode.name;
                            if (JSXElementMap_1.has(name_1)) {
                                var externalClasses_1 = JSXElementMap_1.get(name_1);
                                if (externalClasses_1 && externalClasses_1.length) {
                                    var attribute = node.attributes;
                                    attribute.forEach(function (attr) {
                                        // t.JSXAttribute | t.JSXSpreadAttribute
                                        if (t.isJSXAttribute(attr)) {
                                            if (t.isJSXNamespacedName(attr.name)) {
                                                console.log(chalk.red("taro-vant externalClassesLoader: JSX 还不支持namespace:attr 语法"));
                                            }
                                            else {
                                                var _attrName = attr.name.name;
                                                if (externalClasses_1.includes(_attrName)) {
                                                    attr.name.name =
                                                        _attrName === "className"
                                                            ? "custom-class"
                                                            : _attrName.replace(/[A-Z]/g, function (v) { return "-" + v.toLowerCase(); });
                                                }
                                            }
                                        }
                                        else if (t.isJSXSpreadAttribute(attr)) {
                                            console.log(chalk.red("taro-vant externalClassesLoader: Taro 中JSX 不支持 {...Name} 的语法"));
                                        }
                                    });
                                }
                            }
                        }
                        else {
                            console.log(chalk.red("taro-vant externalClassesLoader: Taro 限制了一个页面只有一个组件"));
                        }
                    }
                });
                var newCode = core_1.transformFromAstSync(ast_1, code, buildBabelTransformOptions());
                return callback(null, (newCode === null || newCode === void 0 ? void 0 : newCode.code) || code, (newCode === null || newCode === void 0 ? void 0 : newCode.map) ? __assign(__assign({}, newCode.map), { version: String(newCode.map.version) }) : undefined);
            }
            return callback(null, code);
        })["catch"](function (err) {
            return callback(err, code);
        });
    }
    catch (e) {
        console.log(chalk.yellow(e));
        return callback(null, code);
    }
};
module.exports.pitch = function (__path__) {
    if (this.resourceQuery || this.query)
        return undefined; // 因为Taro 不知道为什么会加上query之后再次进入这里，所以pitch这里的流程还是保证只需要进行一次收集
    __path__ = this.resourcePath;
    if (PathToExternalClasses.has(__path__))
        return undefined;
    print(chalk.greenBright("taro-vant externalClassesLoader pitch: ") + __path__);
    if (__path__.includes(path.resolve(this.context, "./app"))) {
        print(__path__);
        return undefined;
    }
    try {
        var ast_2 = core_1.parseSync(fs.readFileSync(__path__).toString(), buildBabelTransformOptions());
        traverse_1["default"](ast_2, {
            // NOTE：单独针对taro-vant的组件风格进行模式识别，我不太熟悉ast的处理，所以只能有限于taro-vant的组件了
            ExportDefaultDeclaration: function (astPath) {
                var declar = astPath.node.declaration;
                if (t.isIdentifier(declar)) {
                    var exportDefaultComponentName_1 = declar.name;
                    traverse_1["default"](ast_2, {
                        Identifier: function (astPath) {
                            var node = astPath.node;
                            var propname = node.name;
                            if (propname === "externalClasses") {
                                var parentNode = astPath.parent;
                                if (t.isMemberExpression(parentNode)) {
                                    if (t.isIdentifier(parentNode.object)) {
                                        var parentName = parentNode.object.name;
                                        if (parentName === exportDefaultComponentName_1) {
                                            var assginParent = astPath.parentPath.parent;
                                            if (t.isAssignmentExpression(assginParent)) {
                                                var arrayNode = assginParent.right;
                                                if (t.isArrayExpression(arrayNode)) {
                                                    var keyPath = path.normalize(__path__);
                                                    // const ext = path.parse(keyPath).ext;
                                                    PathToExternalClasses.set(keyPath, arrayNode.elements
                                                        .map(function (v) {
                                                        if (t.isStringLiteral(v)) {
                                                            var _class = v.value;
                                                            if (_class === "custom-class") {
                                                                return "className";
                                                            }
                                                            else {
                                                                return _class.replace(/-(.)/g, function (v) {
                                                                    return v[1].toUpperCase();
                                                                });
                                                            }
                                                        }
                                                        else {
                                                            return "";
                                                        }
                                                    })
                                                        .filter(Boolean));
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        //
                                    }
                                }
                            }
                        }
                    });
                }
            }
        });
    }
    catch (e) {
        console.log(chalk.yellow(e));
        return undefined;
    }
};
