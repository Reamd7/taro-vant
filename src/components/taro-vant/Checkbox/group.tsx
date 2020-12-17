import Taro from "@tarojs/taro";
import useControllableValue, { ControllerValueProps } from "../hooks/useControllableValue"
import { ActiveProps, useRelationPropsInject } from "../utils"
import usePersistFn from "../hooks/usePersistFn";
import { VanCheckBoxProps } from ".";
import { View } from "@tarojs/components";

type VanCheckBoxGroupProps = {
  disabled?: boolean; // 是否全局禁用
  max?: number; // 设置最大可选数
  gid: string;
  onChange?: (val: string[]) => void;
  children: React.ReactNode;
  radio?: boolean;
  total: number;
} & ControllerValueProps<Array<string>>

const DefaultProps = {
  disabled: false,
  max: Infinity,
  defaultValue: [] as string[],
} as const

type ActiveVanRateProps = ActiveProps<VanCheckBoxGroupProps, keyof typeof DefaultProps>

const VanCheckBoxGroup: Taro.FunctionComponent<VanCheckBoxGroupProps> = (props: ActiveVanRateProps) => {
  let {
    defaultValue,
    disabled,
    max = props.radio ? 1 : props.max
  } = props;

  if (defaultValue && defaultValue.length > max) {
    throw Error(`VanCheckBoxGroup defaultValue 长度超过了 max = ${max}的限制`);
  }

  const [currentValue, setCurrentValueOnChange] = useControllableValue(props, {
    defaultValue
  })

  const CheckboxChange = usePersistFn((key: string, checked: boolean) => {
    if (disabled) return false; // 禁用就全局禁用不允许修改
    let newCurrentValue: string[] = currentValue || [];
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
  }, [props.onChange, disabled, currentValue, setCurrentValueOnChange, max])

  useRelationPropsInject<VanCheckBoxProps>(props.gid, (props) => {

    const newProps = { ...props };
    if (disabled === true) {
      newProps.disabled = disabled
    }

    const name = props.name;
    if (name) {
      newProps.value = currentValue.includes(name);
      newProps.onChange = (v) => {
        return CheckboxChange(name, v)
      }
    }

    return newProps;
  }, [disabled, currentValue, max], props.total)

  return <View>{props.children}</View>
}

VanCheckBoxGroup.defaultProps = DefaultProps;

export default VanCheckBoxGroup
