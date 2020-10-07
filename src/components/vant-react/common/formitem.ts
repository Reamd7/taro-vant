import Taro, { SetStateAction, useRef, useState, useEffect, useCallback } from "@tarojs/taro";

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
): [M, (val: M) => void, (val: M, onChange?: (val: M) => void) => void]
export function useFormItem<KeyName extends string, M>(props:
  FormField<KeyName, M>
): [M | undefined, (val: M) => void, (val: M, onChange?: (val: M) => void) => void]
export function useFormItem<KeyName extends string, M>({
  fieldName,
  FormData,
  value,
  defaultValue,
}: FormField<KeyName, M>) {
  const initValue = (defaultValue !== undefined ? defaultValue : value);
  const prevValue = useRef(initValue); // ref 值
  const [innerValue, _setInnerValue] = useState(initValue);
  useEffect(() => {
    if (value !== undefined && prevValue.current !== value) { // value 已经定义，且，不等于历史值
      _setInnerValue(value)
      prevValue.current = value;
    }
  }, [value]); // 受控组件
  // 自动更新下的东西。
  const setInnerValue = useCallback((val: M) => {
    if (!!FormData) { // 需要更新外部表单对象
      if (Array.isArray(FormData)) { // 表单对象是 [FromState, setFormState]
        const FormDataState = FormData[0]
        const FormDataDispatch = FormData[1]
        if (fieldName) { // 有传递表单字段值
          FormDataDispatch({
            ...FormDataState,
            [fieldName]: val
          }); // 受控组件，我直接调用SetState，等待 props.value 更新之后的更新
          return; // 禁止调用 _setInnerValue 这里不主动触发更新，因为允许用户在外部通过onChange -> value -> innerValue 的通路进行修改
        }
      } else {
        const FormDataRef = FormData;
        if (fieldName) { // 有传递表单字段值
          FormDataRef.current[fieldName] = val;
        }
      }
    }
    if (value === undefined) { // 非受控组件
      _setInnerValue(val); // 默认行为 主动修改内部值，以和外部表单字段保持统一
    }

    // onChange &&
    //   Taro.nextTick(() => { // NOTE 是否应该内嵌到这里
    //     onChange(val); // 下一Tick 响应更新，不立即进行的原因是?
    //   })
  }, [
    value, fieldName, FormData
  ]);

  const setInnerValueAndChange = useCallback((val: M, onChange?: (val: M) => void) => {
    setInnerValue(val);
    onChange && Taro.nextTick(() => {
      onChange && onChange(val)
    })
  }, [setInnerValue])

  return [innerValue, setInnerValue, setInnerValueAndChange] as const
}
