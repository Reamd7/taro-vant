/**
 * 依赖rxjs的 BehaviorSubject
 */
// import { BehaviorSubject } from 'rxjs'
import Taro from "@tarojs/taro";
import BehaviorSubject from './BehaviorSubject';
const { useEffect, useState, useMemo, useCallback, useRef } = Taro /** api **/;
import { getContext } from './utils';
import useUpdateEffect from 'src/common/hooks/useUpdateEffect';



const relationPropsMap = new Map<
  string,
  BehaviorSubject<(props: any) => any>
>();

const StatusMap = ["mount", "update"] as const;

/**
 * 以 pid 为标识符，注入组件的 props 到外部的状态管理中。
 */
export function useRelationPropsInject<P, AP extends P = P>(pid: string, relation: (props: P) => AP, deps: any[], total: number): AP[];
export function useRelationPropsInject<P, AP extends P = P>(pid: string, relation: (props: P) => AP, deps: any[]): [];
export function useRelationPropsInject<P extends {
  index: number;
  total: number;
}, AP extends P = P>(pid: string, relation: (props: P) => AP, deps: any[]): AP[];
export function useRelationPropsInject<P extends {
  index?: number;
  total?: number;
}, AP extends P = P>(pid: string, relation: (props: P) => AP, deps: any[], total?: number): any {
  const context = getContext();
  const _id = context ? `${context}_${pid}` : null;

  const PropsListRef = useRef<Array<AP>>([]);
  const [PropsList, setPropsList] = useState<Array<AP>>(PropsListRef.current);

  const status = useRef<0 | 1>(0);
  const loopIndex = useRef(0);

  const Fn = useCallback((props: P) => {
    const newProps = relation(props);
    // NOTE : 这个如果要迁移到react中需要进行测试。
    const __total__ = props.total === undefined ? total : props.total;
    if (__total__ === undefined) return newProps; // 如果有total，就进行依赖收集
    const index = props.index === undefined ? loopIndex.current : props.index;

    if (index === 0) {
      PropsListRef.current = Array(__total__);
    }
    PropsListRef.current[index] = (newProps);
    loopIndex.current += 1;
    if (index === __total__) {
      loopIndex.current = 0;
      if (status.current === 0) {
        status.current = 1
      }
      setPropsList(PropsListRef.current);
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

export function RelationPropsInject<T extends {
  index: number;
  total?: number;
}>(self: React.Component<any>, {
  pid, relation, deps, loopEnd, total
}: {
  pid: string,
  relation: (props: T) => T,
  deps: any[],
  total?: number;
  loopEnd: (status: "mount" | "update", PropsList: Array<T>) => void;
}) {
  const context = getContext();
  if (!context) {
    throw Error("no Context")
  }
  const _id = `${context}_${pid}`;

  let status: 0 | 1 = 0;
  let PropsListRef: Array<T> = [];
  let loopIndex: number = 0;

  const createFn = () => {
    return ((props: T) => {
      const newProps = relation(props);
      // NOTE : 这个如果要迁移到react中需要进行测试。
      const __total__ = props.total === undefined ? total : props.total;
      if (__total__ === undefined) return newProps; // 如果有total，就进行依赖收集
      const index = props.index === undefined ? loopIndex : props.index;

      if (index === 0) {
        PropsListRef = Array(__total__);
      }
      PropsListRef[index] = (newProps);
      loopIndex += 1;
      if (index === __total__) {
        loopIndex = 0;
        if (status === 0) {
          status = 1
        }
        loopEnd(StatusMap[status], PropsListRef)
      }
      return newProps
    })
  }

  // =============================
  const state = new BehaviorSubject(
    createFn()
  )
  if (_id) {
    relationPropsMap.has(_id) || relationPropsMap.set(_id, state);
  }
  // =============================

  if (self.componentWillUnmount) {
    const source = self.componentWillUnmount.bind(self)
    self.componentWillUnmount = function () {
      // do something in here
      _id && relationPropsMap.delete(_id);
      source()
    }.bind(self)
  } else {
    self.componentWillUnmount = function () {
      _id && relationPropsMap.delete(_id);
    }
  }

  if (self.shouldComponentUpdate) {
    const source = self.shouldComponentUpdate.bind(self)
    self.shouldComponentUpdate = function (nextProps, nextState, nextContext) {
      // do something in here
      if (deps.reduce((res, val) => {
        if (res) {
          return res;
        } else {
          return nextProps[val] !== this.props[val]
        }
      }, false)) {
        state.next(
          createFn()
        )
      }
      return source(nextProps, nextState, nextContext)
    }.bind(self)
  } else {
    self.shouldComponentUpdate = function (nextProps) {
      // do something in here
      if (deps.reduce((res, val) => {
        if (res) {
          return res;
        } else {
          return nextProps[val] !== this.props[val]
        }
      }, false)) {
        state.next(
          createFn()
        )
      }
      return true
    }
  }
}
