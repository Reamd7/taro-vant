import * as process from "process";
import { IPluginContext } from "@tarojs/service"

async function main(ctx: IPluginContext) {
  const TARO_ENV = process.env.TARO_ENV;
  if (TARO_ENV === "weapp") {
    ctx.modifyWebpackChain(function modifyWebpackChain({ chain }: {
      chain: import("webpack-chain")
    }) {
      chain.module
        .rule("externalClassesLoader")
        .test(/\.[tj]sx$/i)
        .pre()
        .use("externalClassesLoader")
        .loader(
          require.resolve("./externalClassesLoader")
        )
    });
  }
}

module.exports = main
