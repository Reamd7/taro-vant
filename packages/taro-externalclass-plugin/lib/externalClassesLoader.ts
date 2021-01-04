import { loader, Resolve } from "webpack"
import { parseSync, transformFromAstSync } from "@babel/core";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { readFileSync } from "fs";
import * as path from 'path';
import chalk from "chalk";
import { PluginItem, TransformOptions } from "@babel/core";
import * as fs from "fs";
import { ResolverFactory, CachedInputFileSystem, Resolver } from "enhanced-resolve"

const class_method_renamer_1 = require("@tarojs/transformer-wx/lib/src/class-method-renamer");
const functional_1 = require("@tarojs/transformer-wx/lib/src/functional");

const DEBUG = false;
function print(message?: any, ...optionalParams: any[]) {
  DEBUG && console.log(message, ...optionalParams)
}

const PathToExternalClasses: Map<string, string[]> = new Map();
function buildBabelTransformOptions() {
  let plugins = [
    require('@babel/plugin-proposal-do-expressions'),
    require('@babel/plugin-syntax-export-extensions'),
    require('@babel/plugin-transform-flow-strip-types'),
    [require('babel-plugin-transform-define').default, {}],
    class_method_renamer_1.buildVistor()
  ];

  return {
    // filename: exports.transformOptions.sourcePath,
    babelrc: false,
    parserOpts: {
      sourceType: 'module' as 'module',
      "presets": [
        "@babel/preset-env",
        "@babel/preset-flow",
        "@babel/preset-react",
        "@babel/preset-typescript"
      ],
      plugins: ([
        'jsx',
        // 'flow',
        // 'flowComment',
        'typescript',
        'classProperties',
        // 'trailingFunctionCommas',
        // 'asyncFunctions',
        // 'exponentiationOperator',
        'asyncGenerators',
        'objectRestSpread',
        'decorators-legacy',
        'dynamicImport',
        'doExpressions',
      ] as NonNullable<TransformOptions['parserOpts']>['plugins'])
    },
    plugins: plugins
      .concat(["preval"])
      .concat(process.env.TARO_ENV === 'rn' ? [] : functional_1.functionalComponent)
      .concat([
        "minify-dead-code-elimination",
        "minify-guarded-expressions"
      ]) as PluginItem[]
  };
}
let webpackresolve: Resolve | undefined
let myResolver: Resolver | undefined

// const notModuleRegExp = /^\.$|^\.[\\\/]|^\.\.$|^\.\.[\/\\]|^\/|^[A-Z]:[\\\/]/i;
// function isNpmPkg(name: string): boolean {
//   // if (/^(\.|\/)/.test(name)) {
//   if (notModuleRegExp.test(name)) {
//     return false
//   }
//   return true
// }
const extList = [".jsx", ".tsx"];
const excludeList = ["@tarojs/taro"];
const cacheMap: Record<string, string | false> = excludeList.reduce((res, val) => {
  res[val] = false
  return res;
}, {});

module.exports = function (this: loader.LoaderContext, code: string) {
  const callback = this.async()!;
  if ((this.resourceQuery || this.query)) {
    // Taro loader 在不注入 query 的情况才是进行 wxtransformer 的。
    return callback(null, code);
  }

  print(chalk.green("taro-vant externalClassesLoader 处理中: ") + this.resourcePath + this.resourceQuery)
  type Identifier = string;
  const JSXElementMap = new Map<Identifier, string[]>()
  const ast = parseSync(code, buildBabelTransformOptions());

  const handlePath = (__path__: string) => {
    if (cacheMap[__path__] !== undefined) {
      return Promise.resolve(cacheMap[__path__]);
    }
    // if (excludeList.includes(__path__)) {
    //   // 排除list
    //   return Promise.resolve<false>(cacheMap[__path__] = false);
    // }
    return new Promise<string | false>((resolve, reject) => {
      // create a resolver
      if (this._compiler.options.resolve !== webpackresolve || !myResolver) {
        myResolver = ResolverFactory.createResolver({
          // Typical usage will consume the `fs` + `CachedInputFileSystem`, which wraps Node.js `fs` to add caching.
          ...(webpackresolve = this._compiler.options.resolve),
          symlinks: false,
          fileSystem: new CachedInputFileSystem(fs),
          // extensions: [".jsx", ".tsx"],
        });
      }
      myResolver.resolve({}, this.context, __path__, {}, (err /*Error*/, filepath /*string*/) => {
        if (err) {
          reject(err)
        } else if (filepath && extList.includes(path.extname(filepath))) {
          resolve(cacheMap[__path__] = filepath)
        } else {
          resolve(cacheMap[__path__] = false)
        }
        // Do something with the path
      });
    })
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
  }

  const queue: Promise<unknown>[] = []

  traverse(ast, {
    ImportDeclaration(astPath) {
      const node = astPath.node;
      const __path__ = node.source.value;
      const defaultImportKind = node.importKind;
      const specifiers = node.specifiers;

      specifiers.forEach(spec => {
        if (t.isImportNamespaceSpecifier(spec)) {
          // import * as b from "./dd2";
        } else if (t.isImportDefaultSpecifier(spec)) {
          let importKind = defaultImportKind;

          if (importKind === "type") {
            // import type aa from "./dd2";
          } else if (importKind === "value") {
            // import React from "./dd";
            const defaultName = spec.local.name
            if (/[A-Z]/.test(defaultName[0])) { // 首字母大写
              queue.push(
                handlePath(__path__).then(res => {
                  print(__path__, res)
                  if (res) {
                    if (PathToExternalClasses.has(res)) {
                      JSXElementMap.set(defaultName, PathToExternalClasses.get(res)!)
                    }
                  }
                })
              )
            }
          } else if (importKind === "typeof") {
            // TODO
          } else {
            // Error
          }
        } else if (t.isImportSpecifier(spec)) {
          // import { bb, default as Rea2ct, type Bas } from "./dd2";
          let importKind = spec.importKind || defaultImportKind;
          if (importKind === "type") {
            // import { type aa } from "./dd2";
          } else if (importKind === "value") {
            // import { bb, default as Rea2ct } from "./dd2";
            let importName = ""
            if (t.isIdentifier(spec.imported)) {
              // import { a as bb } from "./dd2"; 中 as 的前面标识符
              importName = spec.imported.name
            } else if (t.isStringLiteral(spec.imported)) {
              // TODO ? 这是啥
              importName = spec.imported.value
            }
            // NOTE Taro 的 意义 组件只是 default 导出的。
            const defaultName = spec.local.name
            if (importName === "default" && /[A-Z]/.test(defaultName[0])) {
              queue.push(
                handlePath(__path__).then(res => {
                  print(__path__, res)
                  if (res) {
                    if (PathToExternalClasses.has(res)) {
                      JSXElementMap.set(defaultName, PathToExternalClasses.get(res)!)
                    }
                  }
                })
              )
            }
          } else if (importKind === "typeof") {
            // TODO
          } else {
            // Error
          }
        }
      })
    }
  });

  Promise.all(queue).then(() => {
    if (JSXElementMap.size) {
      traverse(ast, {
        // NOTE：单独针对taro-vant的组件风格进行模式识别，我不太熟悉ast的处理，所以只能有限于taro-vant的组件了
        JSXOpeningElement: (astPath) => {
          const node = astPath.node;
          const JSXIdentifierNode = node.name;
          if (t.isJSXIdentifier(JSXIdentifierNode)) {
            const name = JSXIdentifierNode.name;
            if (JSXElementMap.has(name)) {
              const externalClasses = JSXElementMap.get(name)!;
              if (externalClasses && externalClasses.length) {
                const attribute = node.attributes;
                attribute.forEach(attr => {
                  // t.JSXAttribute | t.JSXSpreadAttribute
                  if (t.isJSXAttribute(attr)) {
                    if (t.isJSXNamespacedName(attr.name)) {
                      console.log(chalk.red("taro-vant externalClassesLoader: JSX 还不支持namespace:attr 语法"))
                    } else {
                      const _attrName = attr.name.name
                      if (externalClasses.includes(_attrName)) {
                        attr.name.name = (_attrName === "className" ? 'custom-class' : _attrName.replace(/[A-Z]/g, (v) => "-" + v.toLowerCase()))
                      }
                    }
                  } else if (t.isJSXSpreadAttribute(attr)) {
                    console.log(chalk.red("taro-vant externalClassesLoader: Taro 中JSX 不支持 {...Name} 的语法"))
                  }
                })
              }
            }
          } else {
            console.log(chalk.red("taro-vant externalClassesLoader: Taro 限制了一个页面只有一个组件"))
          }
        }
      })
      const newCode = transformFromAstSync(ast!, code, buildBabelTransformOptions())
      return callback(null, newCode?.code || code, newCode?.map ? {
        ...newCode.map,
        version: String(newCode.map.version)
      } : undefined);
    }
    return callback(null, code);
  }).catch((err) => {
    return callback(err, code);
  })
}

module.exports.pitch = function (this: loader.LoaderContext, __path__: string) {
  if (this.resourceQuery || this.query) return undefined; // 因为Taro 不知道为什么会加上query之后再次进入这里，所以pitch这里的流程还是保证只需要进行一次收集
  __path__ = this.resourcePath
  if (PathToExternalClasses.has(__path__)) return undefined;
  print(chalk.greenBright("taro-vant externalClassesLoader pitch: ") + __path__)
  if (__path__.includes(
    path.resolve(this.context, "./app")
  )) {
    print(__path__);
    return undefined;
  }
  const ast = parseSync(
    readFileSync(__path__).toString(),
    buildBabelTransformOptions()
  )
  traverse(ast, {
    // NOTE：单独针对taro-vant的组件风格进行模式识别，我不太熟悉ast的处理，所以只能有限于taro-vant的组件了
    ExportDefaultDeclaration: (astPath) => {
      const declar = astPath.node.declaration;
      if (t.isIdentifier(declar)) {
        const exportDefaultComponentName = declar.name;
        traverse(ast, {
          Identifier(astPath) {
            const node = astPath.node;
            const propname = node.name
            if (propname === "externalClasses") {
              const parentNode = astPath.parent
              if (t.isMemberExpression(parentNode)) {
                if (t.isIdentifier(parentNode.object)) {
                  const parentName = parentNode.object.name
                  if (parentName === exportDefaultComponentName) {
                    const assginParent = astPath.parentPath.parent
                    if (t.isAssignmentExpression(assginParent)) {
                      const arrayNode = assginParent.right
                      if (t.isArrayExpression(arrayNode)) {
                        const keyPath = path.normalize(__path__);
                        // const ext = path.parse(keyPath).ext;
                        PathToExternalClasses.set(
                          keyPath, arrayNode.elements.map<string>(v => {
                            if (t.isStringLiteral(v)) {
                              const _class = v.value;
                              if (_class === "custom-class") {
                                return 'className'
                              } else {
                                return _class.replace(/-(.)/g, (v) => v[1].toUpperCase())
                              }
                            } else {
                              return ""
                            }
                          }).filter(Boolean)
                        );
                      }
                    }
                  }
                } else {
                  //
                }
              }
            }
          },
        })
      }
    }
  })
}
