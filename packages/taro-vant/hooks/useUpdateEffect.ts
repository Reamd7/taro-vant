import Taro from "@tarojs/taro";
const { useEffect, useRef } = Taro /** api **/;

const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
  }, deps);
};

export default useUpdateEffect;
