import Taro from "@tarojs/taro";
import { isAlipay } from "./constant";

export function createSelectorQuery(scope: any) {
  return (isAlipay) ? (
    (my.createSelectorQuery() as any).in(scope) as Taro.SelectorQuery
  ) : Taro.createSelectorQuery()
    .in(scope)
}
