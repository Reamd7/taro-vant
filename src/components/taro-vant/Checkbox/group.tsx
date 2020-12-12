const { useMemo, useCallback } = Taro /** api **/;
import { useCheckboxGroupContext } from "./utils";
import useControllableValue, { ControllerValueProps } from "taro-vant/hooks/useControllableValue"
import { ActiveProps } from "taro-vant/utils"

type VanCheckBoxGroupProps = {
  disabled?: boolean; // 是否全局禁用
  max?: number; // 设置最大可选数
  gid: string;
  onChange?: (val: string[]) => void;
  children: React.ReactNode;
  radio?: boolean;
} & ControllerValueProps<Array<string>>

const DefaultProps = {
  disabled: false,
  max: Infinity
} as const

type ActiveVanRateProps = ActiveProps<VanCheckBoxGroupProps, keyof typeof DefaultProps>

const VanCheckBoxGroup: Taro.FunctionComponent<VanCheckBoxGroupProps> = (props: ActiveVanRateProps) => {
  const {
    defaultValue,
    disabled,
    max = props.radio ? 1 : props.max
  } = props;

  const [currentValue, setCurrentValueOnChange] = useControllableValue(props, {
    defaultValue
  })

  const CheckboxChange = useCallback((key: string, checked: boolean) => {
    let newCurrentValue: string[] = currentValue || [];
    if (disabled) return false; // 禁用就全局禁用不允许修改
    const acticeKeyStatus = currentValue && currentValue.includes(key)

    if (checked !== acticeKeyStatus) {
      // 改变状态
      if (checked) {
        if (max === 1 || !currentValue) {
          newCurrentValue = [key]
        } else if (currentValue.length < max) {
          newCurrentValue = [...currentValue, key];
        } else {
          return false;
        }
      } else {
        if (max === 1 || !currentValue) {
          newCurrentValue = []
        } else if (acticeKeyStatus) {
          newCurrentValue = currentValue.filter(val => val !== key)
        } else {
          return false;
        }
      }
      setCurrentValueOnChange(newCurrentValue)
      return true
    } else {
      return false
    }
    // if (checked) {
    //   // add
    //   if (currentValue) {
    //     if (currentValue.includes(key)) {
    //       if (max === 1) {
    //         setCurrentValueOnChange([])
    //       }
    //       return false;
    //     } else {
    //       if (max === 1) {
    //         setCurrentValueOnChange([])
    //       }
    //       if (currentValue.length < max) {
    //         newCurrentValue = [...currentValue, key];
    //       } else {
    //         return false;
    //       }
    //     }
    //   } else {
    //     newCurrentValue = [key]
    //   }
    // } else {
    //   // remove
    //   if (currentValue) {
    //     if (currentValue.includes(key)) {
    //       newCurrentValue = currentValue.filter(val => val !== key)
    //     } else {
    //       return false;
    //     }
    //   } else {
    //     newCurrentValue = []
    //   }
    // }
    // setCurrentValueOnChange(newCurrentValue)
    // return true; // needChange
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


export default VanCheckBoxGroup
