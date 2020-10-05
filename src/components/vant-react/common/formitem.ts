import { SetStateAction, useMemo, useRef, useState, useEffect, useCallback } from "@tarojs/taro";

export type FormField<KeyName extends string, M> = {
  fieldName?: KeyName;
  FormData?: Taro.MutableRefObject<{
    [key in KeyName]?: M
  }> | [
    { [key in KeyName]?: M },
    Taro.Dispatch<SetStateAction<{ [key in KeyName]?: M }>>
  ]
  defaultValue?: M;
  value?: M;
}
export function useFormItem<KeyName extends string, M>(props:
  Omit<FormField<KeyName, M>, "defaultValue"> & {
    defaultValue: M
  }
): [M, (val: M) => void]
export function useFormItem<KeyName extends string, M>(props:
  FormField<KeyName, M>
): [M | undefined, (val: M) => void]
export function useFormItem<KeyName extends string, M>({
  fieldName,
  FormData,
  value,
  defaultValue,
}: FormField<KeyName, M>) {
  const isArray = useMemo(() => !!(FormData && Array.isArray(FormData)), [FormData]);
  const initValue = (defaultValue !== undefined ? defaultValue : value);
  const prevValue = useRef(initValue); // ref 值
  const [innerValue, _setInnerValue] = useState(initValue);
  useEffect(() => {
    if (value !== undefined && prevValue.current !== value) { // value 已经定义，且，不等于历史值
      _setInnerValue(value)
      prevValue.current = value;
    }
  }, [value]); // 受控组件
  const FormDataState = isArray ? FormData![0] as { [key in KeyName]?: M } : null;
  const FormDataDispatch = isArray ? FormData![1] as Taro.Dispatch<SetStateAction<{ [key in KeyName]?: M }>> : null;
  const FormDataRef = isArray ? null : (FormData! as Taro.MutableRefObject<{
    [key in KeyName]?: M
  }>) || null;
  // 自动更新下的东西。
  const setInnerValue = useCallback((val: M) => {
    if (FormDataState && FormDataDispatch && fieldName) {
      FormDataDispatch({
        ...FormDataState,
        [fieldName]: val
      }); // 受控组件，我直接调用SetState，等待 props.value 更新之后的更新
    } else if (fieldName && FormDataRef) {
      FormDataRef.current[fieldName] = val;
      _setInnerValue(val); // 非受控组件，这个因为也没有调用外部的SetState，所以也不会出现 prop.value 的更新。
    } else {
      _setInnerValue(val); // 默认行为
    }
    // 这里不主动触发更新，因为允许用户在外部通过onChange -> value -> innerValue 的通路进行修改
    // 自己也可以在外部函数调用处主动处理

    // onChange &&
    //   Taro.nextTick(() => { // NOTE 是否应该内嵌到这里
    //     onChange(val); // 下一Tick 响应更新，不立即进行的原因是?
    //   })
  }, [
    fieldName, FormDataState, FormDataDispatch, FormDataRef
  ]);

  return [innerValue, setInnerValue] as const
}
