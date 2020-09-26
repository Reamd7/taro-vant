import Taro, { useCallback, getCurrentPages } from "@tarojs/taro";
import memoize from "fast-memoize";
import classNames from 'classnames';
import bem from "./bem";
import { CSSProperties } from "react";

function addUnit(value?: string | number | null) {
  if (value == null) {
    return undefined;
  } else if (typeof value === "number") {
    return (value * 2) + "rpx"
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
  return addUnit
}

export function useMemoClassNames() {
  return classNames
}

export function useMemoCssProperties() {
  return CssProperties
}

export function useMemoBem() {
  return bem

}

export const noop = () => { }

let systemInfo: Taro.getSystemInfoSync.Result | null = null;
export function nextTick(fn: Function) {
  return setTimeout(() => {
    fn();
  }, 1000 / 30);
}
export function getSystemInfoSync() {
  if (systemInfo == null) {
    systemInfo = Taro.getSystemInfoSync();
  }
  return systemInfo;
}

// let lastTime = 0;
// export const requestAnimationFrame = function (callback) {
//   var currTime = Date.now();
//   var timeToCall = Math.max(0, 30 - (currTime - lastTime));
//   // console.log(16 - (currTime - lastTime));
//   const id = setTimeout(function () {
//     callback(currTime + timeToCall);
//   }, timeToCall);
//   lastTime = currTime + timeToCall;
//   // console.log(lastTime);
//   return id;
// };

export const cancelAnimationFrame = function (id: ReturnType<typeof requestAnimationFrame>) {
  clearTimeout(id);
}
export function requestAnimationFrame(cb: Function) {
  // const Info = systemInfo || (systemInfo = getSystemInfoSync());
  // const el = Taro
  //   .createSelectorQuery()
  //   .selectViewport()
  //   .boundingClientRect();
  // console.log(performance.now())
  // if (Info.platform === 'devtools') {
    return nextTick(cb);
  // }
  // return el.exec(() => {
  //   cb();
  // });
}


export const isH5 = process.env.TARO_ENV === "h5";
export const isWeapp = (process.env.TARO_ENV !== "h5" && process.env.TARO_ENV !== "rn")


export function getContext() {
  const pages = getCurrentPages(); // weapp + h5 都支持
  if (pages.length > 0) {
    return pages[pages.length - 1].route
  } else {
    return null
  }
}
