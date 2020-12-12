import Taro from "@tarojs/taro";
const { useMemo } = Taro /** api **/;
import "./index.less";
import { bem, useMemoClassNames, isExternalClass, isNormalClass, addUnit, CssProperties } from "taro-vant/utils"
import { View } from "@tarojs/components";
import VanLoading from "../Loading";
import useControllableValue, { ControllerValueProps } from "taro-vant/hooks/useControllableValue"
import { BLUE, GRAY_DARK } from "../common/color";

const DefaultProps = {
  size: 30,
  activeValue: true,
  inactiveValue: false,
  activeColor: "#1989fa",
  inactiveColor: "#fff"
}

export type VanSwitchProps<ActiveVal = true, INActiveVal = false> = {
  loading?: boolean;
  disabled?: boolean;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
  activeValue?: ActiveVal;
  inactiveValue?: INActiveVal;

  className?: string;
  'custom-class'?: string;
  nodeClass?: string;
  'node-class'?: string;

} & ControllerValueProps<ActiveVal | INActiveVal, "defaultChecked", "checked", "onChange">

function VanSwitch<ActiveVal = true, INActiveVal = false>(props: VanSwitchProps<ActiveVal, INActiveVal>) {

  const classname = useMemoClassNames();
  const css = CssProperties;

  const {
    size = 30,
    activeColor = "#1989fa",
    inactiveColor = "#fff"
  } = props;

  const inactiveValue = (props.inactiveValue || false) as INActiveVal;
  const activeValue = (props.activeValue || true) as ActiveVal;

  const [value, setValue] = useControllableValue<ActiveVal | INActiveVal, VanSwitchProps<ActiveVal, INActiveVal>, "defaultChecked", "checked", "onChange">(props, {
    defaultValue: inactiveValue,
    defaultValuePropName: "defaultChecked",
    valuePropName: "checked",
  })

  const checked = useMemo(() => value === activeValue, [value, activeValue]);

  const loadingColor = useMemo(() => {
    return checked ? activeColor || BLUE : inactiveColor || GRAY_DARK;
  }, [checked, activeColor, inactiveColor])

  return <View
    className={
      classname(
        bem('switch', { on: checked, disabled: props.disabled }),
        isNormalClass && props.className,
        isExternalClass && 'custom-class'
      )
    }
    style={css({
      fontSize: addUnit(size),
      backgroundColor: (checked ? activeColor : inactiveColor)
    })}
    onClick={() => {
      if (!props.disabled && !props.loading) {
        const value = checked ? inactiveValue : activeValue;
        setValue(value)
      }
    }}
  >
    <View
      className={classname(
        "van-switch__node",
        isExternalClass && "node-class",
        isNormalClass && props.nodeClass
      )}
    >
      {props.loading && <VanLoading
        color={loadingColor}
        custom-class="van-switch__loading"
        className="van-switch__loading"
      />}
    </View>
  </View>
}

VanSwitch.defaultProps = DefaultProps

VanSwitch.externalClasses = [
  'custom-class',
  'node-class'
]

VanSwitch.options = {
  addGlobalClass: true
}

export default VanSwitch;
