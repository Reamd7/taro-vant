import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useMemoClassNames, ActiveProps, isExternalClass, isNormalClass, bem } from "../utils"
import "./index.less";
import { useRelationPropsInject } from "../utils/relation";
import { VanTabbarItemProps, ActiveRelationVanTabbarItemProps } from "./item";
import useControllableValue, { ControllerValueProps } from "../hooks/useControllableValue"

export type VanTabbarProps = {
  // active?: number | string;
  // onChange?: (value: number | string) => void;
  // defaultValue?: number | string;

  activeColor?: string;
  inActiveColor?: string;

  fixed?: boolean;
  border?: boolean;
  zIndex?: number;
  safeAreaInsetBottom?: boolean;

  className?: string
  ["custom-class"]?: string

  pid: string;
} & ControllerValueProps<string | number, "defaultValue", "active">

const DefaultProps = {
  activeColor: "#1989fa",
  inActiveColor: "#7d7e80",
  fixed: true,
  border: true,
  zIndex: 1,
  safeAreaInsetBottom: true,
}

export type ActiveVanTabbarProps = ActiveProps<VanTabbarProps, keyof typeof DefaultProps>

/**
 * 这里因为children不可以处理，
 * 所以，像 vant 将 tabbar 和 tabbar-item 区分开是不行的，
 * 必须将两个组合性的组件放在一个组件内使用。
 * @param props
 */
const VanTabbar: Taro.FunctionComponent<VanTabbarProps> = (props: ActiveVanTabbarProps) => {
  const classnames = useMemoClassNames()

  const {
    fixed,
    border,
    zIndex,
    safeAreaInsetBottom,
    activeColor,
    inActiveColor
  } = props

  const [active, setActive] = useControllableValue(props, {
    defaultValue: 0 as string | number,
    valuePropName: "active",
  })

  useRelationPropsInject<ActiveRelationVanTabbarItemProps>(props.pid, (props: VanTabbarItemProps) => {
    return {
      ...props,
      activeColor,
      inActiveColor,
      activeIndex: active,
      onChange: setActive
    };
  }, [
    active,
    setActive,
    activeColor,
    inActiveColor
  ])

  return <View
    className={classnames(
      isNormalClass && props.className,
      isExternalClass && "custom-class",
      border && 'van-hairline--top-bottom', // hairline.less
      bem('tabbar', { fixed, safe: safeAreaInsetBottom })
    )}
    style={zIndex ? { zIndex } : undefined}
  >
    {props.children}
  </View>
}
VanTabbar.options = {
  addGlobalClass: true
}
VanTabbar.externalClasses = [
  "custom-class"
]
VanTabbar.defaultProps = DefaultProps;

export default VanTabbar;
