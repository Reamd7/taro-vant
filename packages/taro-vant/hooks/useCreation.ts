import Taro from "@tarojs/taro";
const { useState } = Taro /** api **/;
import useUpdateEffect from './useUpdateEffect';

export default function useCreation<T>(factory: () => T, deps: any[]): T {

  const [state, setState] = useState(factory);
  useUpdateEffect(() => {
    setState(factory())
  }, deps);
  return state
};
