import Taro from "@tarojs/taro";
const { useState, useRef, useEffect } = Taro /** api **/;

export default function useRefState<S>(initialState: S | (() => S)) {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });
  return [
    state, stateRef, setState
  ] as const
}
