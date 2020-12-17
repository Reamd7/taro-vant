const path = require('path');
const fs = require('fs-extra');
const process = require("process");
const { spawnSync, spawn } = require("child_process");

/**
  * @param {{
  *  tempPath:   string;
  *  modules:    string[];
  *  copySrcWxs: boolean;
  * }} pluginOpts
  */
const taroVantConfig = (pluginOpts = {
  tempPath: "components/.temp",
  modules: ["taro-vant"],
  copySrcWxs: false
}) => {
  if (
    pluginOpts == undefined ||
    typeof pluginOpts.tempPath != "string" ||
    !Array.isArray(pluginOpts.modules) ||
    typeof pluginOpts.copySrcWxs != "boolean"
  ) {
    throw Error("taro-vant/plugin 参数有误")
  }
  const cwd = process.cwd()
  const sourcePath = path.resolve(cwd, "src");
  const nodeModulesPath = path.resolve(cwd, "node_modules");
  const TaroModuleDir = path.resolve(nodeModulesPath, "taro-vant");

  const tempPath = pluginOpts.tempPath; // src 下的文件夹路径
  return {
    plugins: [
      '@tarojs/plugin-less',
      [require.resolve("./plugin"), pluginOpts]
    ],
    alias: pluginOpts.modules.reduce((res, v) => {
      res[v] = path.resolve(sourcePath, tempPath, v);
      return res;
    }, {}),
  }
};

module.exports = taroVantConfig
