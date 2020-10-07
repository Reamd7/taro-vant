import { useMemo, useCallback } from "@tarojs/taro";
import { FormField, useFormItem } from "../common/formitem";
import { useCheckboxGroupContext } from "./utils";

type VanCheckBoxGroupProps<Key extends string> = {
  disabled?: boolean; // 是否全局禁用
  max?: number; // 设置最大可选数
  gid: string;
  onChange?: (val: string[]) => void;
  children: React.ReactNode
} & FormField<Key, Array<string>>

export default function VanCheckBoxGroup<Key extends string>(props: VanCheckBoxGroupProps<Key>) {
  const {
    FormData,
    value,
    defaultValue,
    fieldName,

    disabled = false,
    max = -1
  } = props;
  const [currentValue, , setCurrentValueOnChange] = useFormItem({
    FormData,
    value,
    defaultValue,
    fieldName,
  })

  const CheckboxChange = useCallback((key: string, checked: boolean) => {
    let newCurrentValue: string[] = currentValue || [];
    if (disabled) return false; // 禁用就全局禁用不允许修改
    if (checked) {
      // add
      if (currentValue) {
        if (currentValue.includes(key)) {
          return false;
        } else {
          if (max === -1 || currentValue.length < max) {
            newCurrentValue = [...currentValue, key];
          } else {
            return false;
          }
        }
      } else {
        newCurrentValue = [key]
      }
    } else {
      // remove
      if (currentValue) {
        if (currentValue.includes(key)) {
          newCurrentValue = currentValue.filter(val => val !== key)
        } else {
          return false;
        }
      } else {
        newCurrentValue = []
      }
    }
    setCurrentValueOnChange(newCurrentValue, props.onChange)
    return true; // needChange
  }, [props.onChange, disabled, currentValue, setCurrentValueOnChange])

  const contextValue = useMemo(() => {
    return {
      groupdisabled: disabled,
      max: max,
      value: currentValue || [],
      onChange: CheckboxChange
    }
  }, [disabled, currentValue, CheckboxChange, max])

  const Context = useCheckboxGroupContext(props.gid, contextValue);
  if (!Context) {
    return null;
  }

  return <Context.Provider value={contextValue}>{props.children}</Context.Provider>
}
