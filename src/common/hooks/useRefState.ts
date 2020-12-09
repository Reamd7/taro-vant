import { useState, useRef, useEffect } from '@tarojs/taro' /** api **/;

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
