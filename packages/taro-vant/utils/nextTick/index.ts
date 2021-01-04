import { isH5, isWeapp } from "../constant";
import Taro from "@tarojs/taro";

export function nextTick(fn: (...args: any[]) => any) {
  if (isWeapp) {
    return Taro.nextTick(fn)
  } else if (isH5) {
    return requestAnimationFrame(fn)
  } else {
    setTimeout(() => {
      fn();
    }, 1000 / 30);
  }
}
export default nextTick;
