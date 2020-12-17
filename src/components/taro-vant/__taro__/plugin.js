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

  ctx.onBuildStart(async => {
    console.log(chalk.green('编译开始！'));
    let exists = true;
    modulesList.forEach(name => {
      const npmDir = nodeModulesNamePath[name].npm
      const srcDir = path.resolve(sourcePath, nodeModulesNamePath[name].temp);
      if (!fs.existsSync(srcDir)) {
        exists = false;
        fs.ensureSymlinkSync(
          npmDir,
          srcDir,
          "junction"
        );
        console.log(chalk.green(`taro-vant/plugin 完成:`), `创建 ${name} 文件夹软连接`)
      }
    });
    if (!exists) {
      const { spawnSync } = require("child_process");
      var spawnObj = spawnSync(process.argv[0], process.argv.slice(1), {
        cwd: process.cwd(),
        stdio: "inherit",
        stdout: "inherit",
        stderr: "inherit"
      })
      process.exit(0)
    }
  });

  let rely = []
  let deleteList = new Set();
  ctx.modifyBuildAssets(args => {
    if (isNotMini) return;
    modulesList.forEach(k => {
      console.log(chalk.green(`taro-vant/plugin :`), `依赖收集 node_modules/${k} 下的  wxml`)
    })
    // const tempReg = new RegExp(`(.*)node_modules/(${pluginOpts.modules.join("|")})\/`)
    const tempReg = new RegExp(`(.*)/(${modulesList.join("|")})\/`)
    rely = Object.keys(args.assets)
      .filter((todoPath) =>
        // "npm/taro-vant/ActionSheet/index.wxml" yarn
        // "npm/.pnpm/taro-vant@1.0.2/node_modules/taro-vant/ActionSheet/index.wxml" pnpm
        tempReg.test(todoPath) && (todoPath !== `${tempPath}/${todoPath.replace(tempReg, '$2/')}`)
      )
      .map(todoPath => {
        const set = todoPath.match(tempReg);
        if (set) {
          deleteList.add(
            path.resolve(outputPath, set[0])
          )
        }
        return [
          path.resolve(
            outputPath, todoPath
          ),
          path.resolve(
            outputPath, `${tempPath}/${todoPath.replace(tempReg, '$2/')}`
          )
        ]
      })
  });

  ctx.onBuildFinish(async () => {
    if (isNotMini) return;

    console.log(chalk.yellow(`taro-vant/plugin 开始:`), "移动 wxml");
    await Promise.all(rely.map(v => {
      return fs.move(v[0], v[1])
    }))
    console.log(chalk.green(`taro-vant/plugin 完成:`), "移动 wxml");
    await Promise.all(
      [...deleteList].map(v => {
        console.log(chalk.yellow(`taro-vant/plugin 开始:`), "删除 " + v)
        return fs.remove(v)
      })
    );
    console.log(chalk.green(`taro-vant/plugin 完成:`), `删除 移动后的文件夹`)
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
