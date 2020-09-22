import { useCallback } from "@tarojs/taro";
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
  }, { } as T)
}


export function useMemoAddUnit() {
  return useCallback(memoize(addUnit), [])
}

export function useMemoClassNames() {
  return useCallback(memoize(classNames), [])
}

export function useMemoCssProperties(){
  return useCallback(memoize(CssProperties), [])
}

export function useMemoBem() {
  return useCallback(memoize(bem), [])

}

export const noop = ()=>{}