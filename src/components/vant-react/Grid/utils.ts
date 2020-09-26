import Taro, { useMemo, useContext, useEffect } from '@tarojs/taro';
import { getContext } from '../common/utils';
import { VanGridProps } from '.';

export type GridContextType = Required<Omit<VanGridProps, "gid" | "className" | "custom-class">>
export const GridRelationMap = new Map<string, Taro.Context<GridContextType>>();

export const useGridContext = function (id: string, defaultValue: GridContextType) {
  const page = getContext()
  const key = page ? `${id}${page}` : null;

  const Context = useMemo(() => {
    if (key) {
      const val = GridRelationMap.get(key);

      if (val) {
        return val
      } else {
        const context = Taro.createContext<GridContextType>(defaultValue);
        GridRelationMap.set(key, context);

        return context;
      }
    } else {
      return null
    }
  }, [key]);

  useEffect(() => {
    return function () {
      if (key) {
        GridRelationMap.delete(key)
      }
    }
  }, [key])
  return Context;
}

export const useGridItemContext = function (id: string) {
  const page = getContext()
  const key = page ? `${id}${page}` : null;
  const Context = useMemo(() => {
    if (key) {
      const val = GridRelationMap.get(key);

      if (val) {
        return val
      } else {
        throw `ID = ${id} 组件未挂载`
        // return null;
      }
    } else {
      throw `ID = ${id} 组件未挂载`
      // return null
    }
  }, [key]);
  return useContext(Context)
}
