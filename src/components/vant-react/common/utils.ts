import Taro, { getCurrentPages, useContext, useEffect, useMemo, useDidShow, useState, useCallback } from "@tarojs/taro";
// import memoize from "fast-memoize";
import classNames from 'classnames';
import bem from "./bem";
import { CSSProperties } from "react";
const dpi = 2;
export function addUnit(value?: string | number | null) {
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

/**
 * https://github.com/fjc0k/vtils/blob/v2/packages/taro/src/hooks/useScope.ts#L18
 */
function _useScope() {
  const [scope, setScope] = useState<any>(null)
  useDidShow(function (this: any) {
    setScope(this.$scope)
  })
  return scope
}

/**
 * TODO hack
 */
export function useScopeRef() {
  const [state, setState] = useState<any>(
    Taro.useScope ? Taro.useScope() : null
  );

  const scopeRef = useCallback((ref: any) => {
    if (ref) {
      if (isWeapp) {
        setState(ref._component)
      } else if (isH5) {
        setState(ref._parentComponent)
      }
    }
  }, [])

  return [state, scopeRef] as const;
}

export function useScope() {
  return Taro.useScope ? Taro.useScope() : _useScope()
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
export const isWeapp = process.env.TARO_ENV === "weapp"
export const isExternalClass = isWeapp;
export const isNormalClass = isH5 || process.env.TARO_ENV === "alipay";


const currentPage: Taro.Page | null = null
export function usePage() {
  return useScope()
}


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
    if (process.env.TARO_ENV === "h5") {
      return page.$router.path // TODO 坑
    }
    return page.route
  } else {
    return null;
  }
}

const NullContext = Taro.createContext(null);

export function GroupContextCreator<T>(ComponentName: string) {
  const RelationMap = new Map<string, Taro.Context<T>>();

  const useGroupContainerContext = function (id: string, defaultValue: T) {
    const page = getContext()
    const key = page ? `${id}${ComponentName}${page}` : null;

    const Context = useMemo(() => {
      if (key) {
        const val = RelationMap.get(key);

        if (val) {
          return val
        } else {
          const context = Taro.createContext<T>(defaultValue);
          RelationMap.set(key, context);

          return context;
        }
      } else {
        return null
      }
    }, [key]);

    useEffect(() => {
      return function () {
        if (key) {
          RelationMap.delete(key)
        }
      }
    }, [key])
    return Context;
  }

  function useGroupItemContext(id: undefined): null
  function useGroupItemContext(id: string): T
  function useGroupItemContext(id: string | undefined): T | null
  function useGroupItemContext(id: string | undefined) {
    const page = getContext()
    const key = page ? `${id}${ComponentName}${page}` : null;
    // const Context = useMemo(() => {
    //   if (key) {
    //     const val = RelationMap.get(key);

    //     if (val) {
    //       return val
    //     } else {
    //       throw `ID = ${id} ${ComponentName} 组件未挂载？`
    //       // return null;
    //     }
    //   } else {
    //     throw `ID = ${id} ${ComponentName} 组件未挂载！`
    //     // return null
    //   }
    // }, [key]);
    return useContext(id === undefined ? NullContext :
      key ? RelationMap.get(key) || NullContext : NullContext
    )
  }

  return {
    useGroupContainerContext,
    useGroupItemContext
  } as const
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
export function range(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}


export type ActiveProps<P, K extends keyof P> = Omit<P, K> & Required<Pick<P, K>> & {
  children?: React.ReactNode
};
