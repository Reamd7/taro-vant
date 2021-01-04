import { getSystemInfoSync } from "./constant";
import Taro from "@tarojs/taro";
const { useMemo, useCallback } = Taro /** api **/;

const dpi = 2;
export function addUnit(value?: string | number | null) {
  if (value == null) {
    return undefined;
  } else if (typeof value === "number") {
    return Math.floor(value * getSystemInfoSync().windowWidth / 750 * dpi) + "px"
    // if (isH5) {
    //   return Math.floor(value * getSystemInfoSync().windowWidth / 750  * dpi) + "px"
    // } else {
    //   return (value) + "rpx"
    // }
  } else {
    return value
  }
}

export function useMemoAddUnit() {
  const memoMap = useMemo(() => ({}), []);
  return useCallback((value?: string | number | null | undefined) => {
    if (value != undefined) {
      if (memoMap[value]) {
        return memoMap[value]
      } else {
        return (memoMap[value] = addUnit(value))
      }
    }
    return undefined
  }, []);
}

export function pxUnit(value: number) {
  return (value * getSystemInfoSync().pixelRatio / dpi) + "px"
}
