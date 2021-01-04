import Taro from "@tarojs/taro";
import { createSelectorQuery } from "./createSelectorQuery";

export function getRect(
  scope: any,
  selector: string
): Promise<Taro.NodesRef.BoundingClientRectCallbackResult> {
  return new Promise<Taro.NodesRef.BoundingClientRectCallbackResult>((resolve) => {
    createSelectorQuery(scope)
      .select(selector)
      .boundingClientRect()
      .exec((rect = []) => resolve(rect[0]));
  });
}
