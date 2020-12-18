import Taro from "@tarojs/taro";
const { useState, useCallback } = Taro /** api **/;
import { isH5, noop } from "../constant";
export const useScopeRef = isH5 ?
  () => {
    const [state, setState] = useState<any>(
      null
    );
    const scopeRef = useCallback((ref: any) => {
      if (ref) {
        setState(ref._parentComponent)
      }
    }, [])

    return [state, scopeRef] as const;
  } :
  () => {
    const scope = Taro.useScope();
    return [scope, noop] as const
  }
export default useScopeRef
