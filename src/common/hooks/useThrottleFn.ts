import Taro from "@tarojs/taro";
const { useRef } = Taro /** api **/;
import useCreation from "./useCreation";
import { throttle } from 'throttle-debounce';

type Fn = (...args: any[]) => any;

export function useThrottleFn<T extends Fn>(fn: T, options?: {
  delay: number;
  noTrailing?: boolean;
  debounceMode?: boolean;
}) {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  const throttled = useCreation(
    () =>
      throttle<T>(
        options ? options.delay : 100,
        options ? options.noTrailing || true : true,
        ((...args: any[]) => {
          return fnRef.current(...args);
        }) as T,
        options ? options.debounceMode : false,
      ),
    [],
  );

  return {
    run: (throttled as unknown) as T,
    cancel: throttled.cancel,
  };
}
