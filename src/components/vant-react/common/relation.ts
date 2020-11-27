/**
 * 依赖rxjs的 BehaviorSubject
 */
// import { BehaviorSubject } from 'rxjs'
import BehaviorSubject from './BehaviorSubject';
import { useEffect, useState, useMemo, useCallback, useRef } from '@tarojs/taro';
import { getContext } from './utils';
import useUpdateEffect from 'src/common/hooks/useUpdateEffect';



const relationPropsMap = new Map<
  string,
  BehaviorSubject<(props: any) => any>
>()
/**
 * 以 pid 为标识符，注入组件的 props 到外部的状态管理中。
 *
 * NOTE：
 * ```
 * nerv/src/render-queue.ts
 * // 就是这个原因 pop ，所以更新的时候是逆序更新的，但是mount的时候是顺序挂载的。
 * // NOTE : 这个如果要迁移到react中需要进行测试。
 * function rerender(isForce) {
      if (isForce === void 0) isForce = false;

      var p;
      var list = items;
      items = [];
      // tslint:disable-next-line:no-conditional-assignment
      while (p = list.pop()) { // 因为这里的原因，所以这里更新是逆序的。
          if (p._dirty) {
              updateComponent(p, isForce);
          }
      }
  }
  ```
 *
 * @param pid
 * @param props
 */
export function useRelationPropsInject<T extends {
  index: number;
  total: number;
}>(pid: string, relation: (props: T) => T, deps: any[]) {
  const context = getContext();
  const _id = context ? `${context}_${pid}` : null;

  const PropsListRef = useRef<Array<T>>([]);
  const [PropsList, setPropsList] = useState<Array<T>>(PropsListRef.current);

  const status = useRef<"update" | "mount">("mount");

  const Fn = useCallback((props: T) => {
    const newProps = relation(props);
    const index = props.index;
    // NOTE : 这个如果要迁移到react中需要进行测试。
    if (status.current === "mount") {
      if (index === 0) {
        PropsListRef.current = Array(props.total);
      }
      PropsListRef.current[index] = (newProps);
      if (index === (props.total - 1)) {
        setPropsList(PropsListRef.current);
        status.current = "update"
      }
    } else {
      if (index === (props.total - 1)) {
        PropsListRef.current = Array(props.total);
      }
      PropsListRef.current[index] = (newProps);
      if (index === 0) {
        setPropsList(PropsListRef.current);
      }
    }

    return newProps
  }, [relation, ...deps])

  const [state] = useState(() => {
    const state = new BehaviorSubject(Fn)
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

  useEffect(() => {
    state.next(Fn);
  }, [...deps]) // 通知更新

  return PropsList
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

