import Taro from "@tarojs/taro";

import "./index.less";
import { useMemoBem, useMemoClassNames, isH5, isWeapp, addUnit, useMemoCssProperties } from "../common/utils";
import { View } from "@tarojs/components";
import VanLoading from "../loading";

export type VanSwitchProps<ActiveVal, INActiveVal> = {
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
}

const VanSwitch = <ActiveVal, INActiveVal>(props: VanSwitchProps<ActiveVal, INActiveVal>) => {
  const bem = useMemoBem();
  const classname = useMemoClassNames();
  const css = useMemoCssProperties();

  const {
    size = 30,
    activeValue = true,
    inactiveValue = false,
    activeColor = "#1989fa",
    inactiveColor = "#fff"
  } = props;

  return <View
    className={
      classname(
        bem('switch', { on: value === activeValue, disabled: props.disabled }),
        isH5 && props.className,
        isWeapp && 'custom-class'
      )
    }
    style={css({
      fontSize: addUnit(size),
      backgroundColor: (checked ? activeColor : inactiveColor)
    })}
    onClick={onClick}
  >
    <View
      className={classname(
        "van-switch__node",
        isWeapp && "node-class",
        isH5 && props.nodeClass
      )}
    >
      {loading && <VanLoading
        color={loadingColor}
        custom-class="van-switch__loading"
        className="van-switch__loading"
      />}
    </View>
  </View>
}
