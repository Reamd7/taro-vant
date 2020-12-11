const { useRef, useState, useEffect, useCallback, SetStateAction } = Taro /** api **/;
import { nextTick } from "./utils";
export type FormField<KeyName extends string, M> = {
  fieldName?: KeyName;
  FormData?: Taro.MutableRefObject<{
    [key in KeyName]?: M
  }> | [
    { [key in KeyName]?: M },
    React.Dispatch<SetStateAction<{ [key in KeyName]?: M }>>
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
  value: propsvalue,
  defaultValue,
}: FormField<KeyName, M>) {
  const initValue = (defaultValue !== undefined ? defaultValue : propsvalue);
  const prevValue = useRef(initValue); // ref 值
  const [value, _setValue] = useState(initValue);
  useEffect(() => {
    if (propsvalue !== undefined && prevValue.current !== propsvalue) { // value 已经定义，且，不等于历史值
      _setValue(propsvalue)
      prevValue.current = propsvalue;
    }
  }, [propsvalue]); // 受控组件
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
    if (propsvalue === undefined) { // 非受控组件
      _setValue(val); // 默认行为 主动修改内部值，以和外部表单字段保持统一
    }

    // onChange &&
    //   nextTick(() => { // NOTE 是否应该内嵌到这里
    //     onChange(val); // 下一Tick 响应更新，不立即进行的原因是?
    //   })
  }, [
    propsvalue, fieldName, FormData
  ]);

  const setInnerValueAndChange = useCallback((val: M, onChange?: (val: M) => void) => {
    setInnerValue(val);
    onChange && nextTick(() => {
      onChange && onChange(val)
    })
  }, [setInnerValue])

  return [value, setInnerValue, setInnerValueAndChange] as const
}

export function useFormItemFormat<KeyName extends string, M, InnerValue>(
  props: Omit<FormField<KeyName, M>, "defaultValue"> & { defaultValue: M }, format: (val?: M) => InnerValue
): [
  M, (val: M) => void, (val: M, onChange?: (val: M) => void) => void,
  InnerValue, (val: InnerValue) => void
]
export function useFormItemFormat<KeyName extends string, M, InnerValue>(
  props: FormField<KeyName, M>, format: (val?: M) => InnerValue
): [
  M | undefined, (val: M) => void, (val: M, onChange?: (val: M) => void) => void,
  InnerValue, (val: InnerValue) => void
]
export function useFormItemFormat<KeyName extends string, M, InnerValue>({
  fieldName,
  FormData,
  value: propsvalue,
  defaultValue,
}: FormField<KeyName, M>, format: (val?: M) => InnerValue) {
  const initValue = (defaultValue !== undefined ? defaultValue : propsvalue);
  const prevValue = useRef(initValue); // ref 值
  const [value, _setValue] = useState(initValue);
  const [innerValue, setInnerValue] = useState(format(value));
  useEffect(() => {
    if (propsvalue !== undefined && prevValue.current !== propsvalue) { // value 已经定义，且，不等于历史值
      _setValue(propsvalue)
      prevValue.current = propsvalue;
    }
  }, [propsvalue]); // 受控组件

  useEffect(() => {
    setInnerValue(format(value))
  }, [value, format])

  // 自动更新下的东西。
  const setValue = useCallback((val: M) => {
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
    if (propsvalue === undefined) { // 非受控组件
      _setValue(val); // 默认行为 主动修改内部值，以和外部表单字段保持统一
    }
  }, [
    propsvalue, fieldName, FormData
  ]);

  const setValueAndChange = useCallback((val: M, onChange?: (val: M) => void) => {
    setValue(val);
    onChange && nextTick(() => {
      onChange && onChange(val) // 下一Tick 响应更新，不立即进行的原因是?
    })
  }, [setValue])

  return [
    value, setValue, setValueAndChange,
    innerValue, setInnerValue
  ] as const
}
