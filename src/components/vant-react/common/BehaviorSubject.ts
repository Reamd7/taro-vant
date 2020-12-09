import Taro from "@tarojs/taro";
const { useState, useCallback, useEffect } = Taro /** api **/;

/**
 * 模拟 rxjs 的 BehaviorSubject
 */
export default class BehaviorSubject<T> {
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

export function useListenerBehaviorSubject<T>(sub: BehaviorSubject<T>) {
  const [state, __setState__] = useState(() => sub.getValue()); // Attention 这里的值不能是函数
  const setState = useCallback((v: T) => {
    if (typeof v === "function") {
      __setState__(() => v)
    } else {
      __setState__(v)
    }
  }, [])
  useEffect(() => {
    const c = sub.subscribe(setState)
    return function () {
      c.unsubscribe()
    }
  }, [sub])

  return state;
}
