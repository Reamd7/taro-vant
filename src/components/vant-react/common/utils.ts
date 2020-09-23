import Taro, { useCallback } from "@tarojs/taro";
import memoize from "fast-memoize";
import classNames from 'classnames';
import bem from "./bem";
import { CSSProperties } from "react";

function addUnit(value?: string | number | null) {
  if (value == null) {
    return undefined;
  } else if (typeof value === "number") {
    return value + "rpx"
  } else {
    return value
  }
}
function CssProperties<T extends CSSProperties>(dict?: T | null | undefined) {
  if (!dict) return {} as T;
  return Object.keys(dict).reduce<T>((res, key) => {
    const value = dict[key]
    if (value != null) res[key] = value;
    return res;
  }, {} as T)
}


export function useMemoAddUnit() {
  return useCallback(memoize(addUnit), [])
}

export function useMemoClassNames() {
  return useCallback(memoize(classNames), [])
}

export function useMemoCssProperties() {
  return useCallback(memoize(CssProperties), [])
}

export function useMemoBem() {
  return useCallback(memoize(bem), [])

}

export const noop = () => { }

let systemInfo: Taro.getSystemInfoSync.Result | null = null;
export function nextTick(fn: Function) {
  setTimeout(() => {
    fn();
  }, 1000 / 30);
}
export function getSystemInfoSync() {
  if (systemInfo == null) {
    systemInfo = Taro.getSystemInfoSync();
  }
  return systemInfo;
}
export function requestAnimationFrame(cb: Function) {
  const systemInfo = getSystemInfoSync();
  if (systemInfo.platform === 'devtools') {
    return nextTick(cb);
  }
  return Taro
    .createSelectorQuery()
    .selectViewport()
    .boundingClientRect()
    .exec(() => {
      cb();
    });
}


export const isH5 = process.env.TARO_ENV === "h5";
export const isWeapp = (process.env.TARO_ENV !== "h5" && process.env.TARO_ENV !== "rn")
