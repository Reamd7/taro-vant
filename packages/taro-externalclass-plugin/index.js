/// <reference types='@tarojs/service' />

"use strict";
const process = require('process');
/**
 * @param {import('@tarojs/service').IPluginContext} ctx
 */
function main(ctx) {
  const TARO_ENV = process.env.TARO_ENV;
  const isNotMini = ["h5", "rn"].includes(TARO_ENV)

  if (!isNotMini) {
    /**
      * @param {{
      *  chain: typeof import("webpack-chain"),
      *  webpack: typeof import("webpack")
      * }} args
      */
    function modifyWebpackChain(args) {
      args.chain.module
        .rule("externalClassesLoader")
        .test(/\.[tj]sx$/i)
        .pre()
        .use("externalClassesLoader")
        .loader(
          require.resolve("./lib/externalClassesLoader") // 注入 externalClassesLoader
        )
    }
    ctx.modifyWebpackChain(modifyWebpackChain);
  }

}

module.exports = main;
