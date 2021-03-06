import Taro from "@tarojs/taro";
const { useMemo, useState } = Taro /** api **/;
import useUpdateEffect from './useUpdateEffect';
import usePersistFn from './usePersistFn';

export interface Options<T> {
  defaultValue?: T;
  defaultValuePropName?: string;
  valuePropName?: string;
  trigger?: string;
  onRevert?: VoidFunction
}

export type Props = Record<string, any>;

export type ControllerValueProps<
  T,
  defaultValuePropName extends string = "defaultValue",
  valuePropName extends string = "value",
  TriggerName extends string = "onChange"
  > =
  {
    [defaultValueProp in defaultValuePropName]?: T;
  } & {
    [valueProp in valuePropName]?: T
  } & {
    [onChangeProps in TriggerName]?: (v: T, onRevert: VoidFunction) => void;
  }

function useControllableValue<
  T extends Exclude<any, (...args: any[]) => any>,
  P extends ControllerValueProps<T, defaultValuePropName, valuePropName, TriggerName>,
  defaultValuePropName extends string = "defaultValue",
  valuePropName extends string = "value",
  TriggerName extends string = "onChange"
>(props: P, options: {
  defaultValue: T;
  defaultValuePropName?: defaultValuePropName;
  valuePropName?: valuePropName;
  trigger?: TriggerName;
  onRevert?: VoidFunction;
}): [T, (v: Taro.SetStateAction<T | undefined>) => void]
function useControllableValue<
  T extends Exclude<any, (...args: any[]) => any>,
  P extends ControllerValueProps<T, defaultValuePropName, valuePropName, TriggerName>,
  defaultValuePropName extends string = "defaultValue",
  valuePropName extends string = "value",
  TriggerName extends string = "onChange",
  >(props: P
    , options: {
      defaultValue?: T;
      defaultValuePropName?: defaultValuePropName;
      valuePropName?: valuePropName;
      trigger?: TriggerName;
      onRevert?: VoidFunction;
    }): [T | undefined, (v: T) => void]
function useControllableValue<
  T extends Exclude<any, (...args: any[]) => any>,
  defaultValuePropName extends string = "defaultValue",
  valuePropName extends string = "value",
  TriggerName extends string = "onChange"
>(props: Props = {}, options: {
  defaultValue?: T;
  defaultValuePropName?: defaultValuePropName;
  valuePropName?: valuePropName;
  trigger?: TriggerName;
  onRevert?: VoidFunction;
} = {}) {
  const {
    defaultValue,
    defaultValuePropName = 'defaultValue',
    valuePropName = 'value',
    trigger = 'onChange',
    onRevert
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
    (v: Taro.SetStateAction<T | undefined>) => {
      if (!(valuePropName in props)) {
        setState(v);
      }
      if (props[trigger]) {
        if (typeof v !== "function") {
          const res = props[trigger](v, onRevert);
          if ((valuePropName in props) && res === false && onRevert) {
            onRevert()
          }
        } else {
          const res = props[trigger](
            (v as ((prevState: T | undefined) => T | undefined))(state)
          , onRevert);
          if ((valuePropName in props) && res === false && onRevert) {
            onRevert()
          }
        }
      }
    },
    [props, valuePropName, trigger, onRevert, state],
  );

  return [state, handleSetState] as const;
}


export default useControllableValue;
