import Taro from "@tarojs/taro";
const { useMemo, useContext, useEffect } = Taro /** api **/;

import { getContext } from "./getContext";

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
