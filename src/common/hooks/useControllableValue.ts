import { useMemo, useState } from '@tarojs/taro';
import useUpdateEffect from './useUpdateEffect';
import usePersistFn from './usePersistFn';

export interface Options<T> {
  defaultValue?: T;
  defaultValuePropName?: string;
  valuePropName?: string;
  trigger?: string;
}

export type Props = Record<string, any>;

function useControllableValue<T>(props: Props, options: {
  defaultValue: T;
  defaultValuePropName?: string;
  valuePropName?: string;
  trigger?: string;
}): [T, (v: T) => void]
function useControllableValue<T>(props: Props = {}, options: Options<T> = {}) {
  const {
    defaultValue,
    defaultValuePropName = 'defaultValue',
    valuePropName = 'value',
    trigger = 'onChange',
  } = options;

  const value = props[valuePropName];

  const initialValue = useMemo(() => {
    if (valuePropName in props) {
      return value // 受控组件
    }
    if (defaultValuePropName in props) {
      return props[defaultValuePropName] // 默认值
    }
    return defaultValue // options 的 默认值
  }, []);

  const [state, setState] = useState<T | undefined>(initialValue);

  /* init 的时候不用执行了 */
  useUpdateEffect(() => {
    if (valuePropName in props) {
      setState(value);
    }
  }, [value]);

  const handleSetState = usePersistFn(
    (v: T | undefined) => {
      if (!(valuePropName in props)) {
        setState(v);
      }
      if (props[trigger]) {
        props[trigger](v);
      }
    },
    [props, valuePropName, trigger],
  );

  return [state, handleSetState] as const;
}


export default useControllableValue;
