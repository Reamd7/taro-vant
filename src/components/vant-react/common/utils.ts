import Taro, { getCurrentPages, useCallback } from "@tarojs/taro";
// import memoize from "fast-memoize";
import classNames from 'classnames';
import bem from "./bem";
import { CSSProperties } from "react";
import { CommonEvent } from "@tarojs/components/types/common";
const dpi = 2;
function addUnit(value?: string | number | null) {
  if (value == null) {
    return undefined;
  } else if (typeof value === "number") {
    if (isWeapp) {
      return (value * dpi) + "rpx"
    } else {
      return (value) + "px"
    }
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
export function useScope() {
  return Taro.useScope ? Taro.useScope() : null
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


export function getCurrentPage() {
  const pages = getCurrentPages(); // weapp + h5 都支持
  if (pages.length > 0) {
    return pages[pages.length - 1]
  } else {
    return null
  }
}

export function getContext() {
  const page = getCurrentPage();
  if (page) {
    return page.route
  } else {
    return null;
  }
}


export function getRect(
  scope: WechatMiniprogram.Component.TrivialInstance,
  selector: string
): Promise<Taro.NodesRef.BoundingClientRectCallbackResult> {
  return new Promise<Taro.NodesRef.BoundingClientRectCallbackResult>((resolve) => {
    Taro.createSelectorQuery()
      .in(scope)
      .select(selector)
      .boundingClientRect()
      .exec((rect = []) => resolve(rect[0]));
  });
}

export function getAllRect(
  scope: WechatMiniprogram.Component.TrivialInstance,
  selector: string
): Promise<Taro.NodesRef.BoundingClientRectCallbackResult[]> {
  return new Promise<Taro.NodesRef.BoundingClientRectCallbackResult[]>((resolve) => {
    Taro.createSelectorQuery()
      .in(scope)
      .selectAll(selector)
      .boundingClientRect((rect) => {
        if (Array.isArray(rect) && rect.length) {
          resolve(rect)
        }
      })
      .exec();
  });
}
