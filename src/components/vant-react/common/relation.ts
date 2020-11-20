/**
 * 依赖rxjs的 BehaviorSubject
 */
// import { BehaviorSubject } from 'rxjs'
import { useEffect, useState, useMemo, useCallback } from '@tarojs/taro';
import { getContext } from './utils';
import useUpdateEffect from 'src/common/hooks/useUpdateEffect';

/**
 * 模拟 rxjs 的 BehaviorSubject
 */
class BehaviorSubject<T> {
  private _value: T;
  getValue() {
    return this._value
  }
  constructor(value: T) {
    this._value = value
  }
  listener = new Set<(val: T) => void>();
  next(val: T) {
    this._value = val;
    this.listener.forEach(listener => {
      listener(this._value);
    })
  }
  subscribe(fn: (val: T) => void) {
    this.listener.add(fn);
    return {
      unsubscribe: () => {
        this.listener.delete(fn)
      }
    }
  }
}

const relationPropsMap = new Map<
  string,
  BehaviorSubject<(props: any) => any>
>()
/**
 * 以 pid 为标识符，注入组件的 props 到外部的状态管理中。
 * @param pid
 * @param props
 */
export function useRelationPropsInject<T>(pid: string, relation: (props: T) => T, deps: any[]) {
  const context = getContext();
  const _id = context ? `${context}_${pid}` : null;
  const [state] = useState(() => {
    const state = new BehaviorSubject(relation)
    if (_id) {
      relationPropsMap.has(_id) || relationPropsMap.set(_id, state);
    }
    return state;
  })
  useEffect(() => {
    if (_id) {
      relationPropsMap.has(_id) || relationPropsMap.set(_id, state);
    }
    return function () {
      _id && relationPropsMap.delete(_id);
    }
  }, [_id]); // 有了 id 之后 注入 map 中

  useUpdateEffect(() => {
    state.next(relation);
  }, deps) // 通知更新
}
/**
 * 获取 pid 标识符映射的 props
 * @param pid
 */
export function useRelationPropsListener<T>(pid: string, props: T): T {
  const context = getContext();
  const id = context ? `${context}_${pid}` : null;
  const sub = id ?
    relationPropsMap.has(id) ? relationPropsMap.get(id) || null : null :
    null;

  const [PropsFunction, __setPropsFunction__] = useState(() => {
    if (sub) {
      return sub.getValue()
    } else {
      return null
    }
  });

  const setPropsFunction = useCallback(v => {
    if (typeof v === "function") {
      return __setPropsFunction__(() => v)
    } else {
      return __setPropsFunction__(v)
    }
  }, [])

  useUpdateEffect(() => {
    if (sub) {
      setPropsFunction( // Attention 这里的值不能是函数
        sub.getValue()
      )
    }
  }, [sub])
  useEffect(() => {
    const c = sub ? sub.subscribe(setPropsFunction) : null // 当sub dispatch 之后 同步更新。
    return function () {
      c && c.unsubscribe()
    }
  }, [sub])
  return useMemo(() => {
    if (PropsFunction) {
      return PropsFunction(props)
    } else {
      return props
    }
  }, [PropsFunction, props]);
}

// function useListen<T>(sub: BehaviorSubject<T>) {
//   const [state, __setState__] = useState(() => sub.getValue()); // Attention 这里的值不能是函数
//   const setState = useCallback((v: T) => {
//     if (typeof v === "function") {
//       __setState__(() => v)
//     } else {
//       __setState__(v)
//     }
//   }, [])
//   useEffect(() => {
//     const c = sub.subscribe(setState)
//     return function () {
//       c.unsubscribe()
//     }
//   }, [sub])

//   return state;
// }
