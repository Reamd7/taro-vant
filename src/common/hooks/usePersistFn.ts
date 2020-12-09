import { useCallback, useRef, useEffect } from '@tarojs/taro' /** api **/;

export type noop = (...args: any[]) => any;

export default function usePersistFn<T extends noop>(fn: T, dependencies: any[]) {
  const ref = useRef<T>((() => {
    throw new Error('Cannot call an event handler while rendering.');
  }) as unknown as T);

  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);
  // ref.current = fn;

  return useCallback(((...args) => ref.current(...args)) as T, [ref]);
};
