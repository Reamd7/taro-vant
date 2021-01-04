import Taro from "@tarojs/taro";
import { createSelectorQuery } from "./createSelectorQuery";

export function getAllRect(
  scope: any,
  selector: string
): Promise<Taro.NodesRef.BoundingClientRectCallbackResult[]> {
  return new Promise<Taro.NodesRef.BoundingClientRectCallbackResult[]>((resolve) => {
    createSelectorQuery(scope)
      .selectAll(selector) // 一定要这样写，支付宝需要这样写。。
      .boundingClientRect()
      .exec((rects) => {
        const rect = rects[0]
        if (Array.isArray(rect) && rect.length) {
          resolve(rect)
        }
      });
  });
}
