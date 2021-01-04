/// <reference types='@tarojs/service' />

"use strict";
const path = require('path');
const fs = require('fs-extra');
const util = require("util");
const process = require('process');
const chalk = require("chalk");
/**
 *
 * @param {import('@tarojs/service').IPluginContext} ctx
 * @param {{
 *  tempPath: string;
 *  modules: Record<string, string>;
 *  copySrcWxs: boolean;
 * }} pluginOpts
 */
async function main(ctx, pluginOpts) {
  if (pluginOpts === undefined) {
    throw Error("missing parameter");
  } // 接下来使用 ctx 的时候就能获得智能提示了

  const tempPath = pluginOpts.tempPath;

  const {
    sourcePath,
    outputPath,
    nodeModulesPath,
    appPath,
  } = ctx.paths;
  const modulesList = Object.keys(pluginOpts.modules);
  /**
   * @type {Record<string, {
   *  npm: string;
   *  temp: string;
   * }>}
   */
  const nodeModulesNamePath = modulesList.reduce((res, name) => {
    const temp = path.join(tempPath, name);
    res[name] = {
      npm: path.resolve(nodeModulesPath, name, pluginOpts.modules[name]),
      temp
    }
    return res
  }, {});

  const TARO_ENV = process.env.TARO_ENV;
  const isNotMini = ["h5", "rn"].includes(TARO_ENV)

  ctx.register({
    name: "onReady",
    plugin: "onReady",
    fn: () => {
      console.log(chalk.green('创建文件夹软连接！'));
      modulesList.forEach(function (name) {
        var npmDir = nodeModulesNamePath[name].npm;
        var srcDir = path.resolve(sourcePath, nodeModulesNamePath[name].temp);

        if (!fs.existsSync(srcDir)) {
          fs.ensureSymlinkSync(npmDir, srcDir, "junction");
          console.log(chalk.green(`taro-vant/plugin 完成:`), `创建 ${name} 文件夹软连接`)
        }
      });
    }
  })

  ctx.onBuildFinish(async () => {
    if (isNotMini) return;
    console.log(chalk.yellow(`taro-vant/plugin 开始:`), "复制 wxs | sjs");
    const glob = require('glob');
    const promiseGlob = util.promisify(glob);

    const globPattern = "**/*.?(wxs|sjs)"
    await Promise.all(
      // 模块的wxs
      modulesList.map(name => {
        const srcTemp = path.resolve(sourcePath, nodeModulesNamePath[name].temp);
        const distTemp = path.resolve(outputPath, nodeModulesNamePath[name].temp);
        // TODO glob 模块会忽略软连接，所以要单独处理
        return promiseGlob(globPattern, { cwd: srcTemp, mark: true }).then(files => {
          return Promise.all(
            files.map(file => {
              const srcFile = path.resolve(srcTemp, file)
              const distFile = path.resolve(distTemp, file)
              return fs.copy(srcFile, distFile).then(() => {
                console.log(chalk.green(`taro-vant/plugin 完成:`), `复制 ${srcFile} to ${distFile}`)
              })
            })
          )
        })
      }).concat(
        // src 的 wxs
        pluginOpts.copySrcWxs ? promiseGlob(globPattern, { cwd: sourcePath, mark: true }).then(files => {
          return Promise.all(
            files.map(file => {
              const srcFile = path.resolve(sourcePath, file)
              const distFile = path.resolve(outputPath, file)
              return copy(srcFile, distFile).then(() => {
                console.log(chalk.green(`taro-vant/plugin 完成:`), `复制 ${srcFile} to ${distFile}`)
              })
            })
          )
        }) : []
      )
    )
    console.log(chalk.green('编译结束！'));
  });
}

module.exports = main;
