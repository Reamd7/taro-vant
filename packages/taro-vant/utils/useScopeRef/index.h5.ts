import Taro from "@tarojs/taro";
const { useState, useCallback } = Taro /** api **/;
export function useScopeRef() {
  const [state, setState] = useState<any>(
    null
  );
  const scopeRef = useCallback((ref: any) => {
    setState(ref._parentComponent)
  }, [])

  return [state, scopeRef] as const;
}

export default useScopeRef
