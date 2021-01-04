import Taro from "@tarojs/taro";
import "./index.less";
import useControllableValue, { ControllerValueProps } from "../hooks/useControllableValue"
import { View } from "@tarojs/components";
import { isExternalClass, isNormalClass, useMemoClassNames } from "../utils"
import { useRelationPropsInject } from "../utils/relation";
import { ActiveRelationVanSidebarItemProps, VanSidebarItemProps } from "./item";

export type VanSidebarProps = ControllerValueProps<number, "defaultActiveKey", "activeKey"> & {
  "custom-class"?: string;
  className?: string;

  pid: string;
}

const VanSidebar: Taro.FunctionComponent<VanSidebarProps> = (props) => {
  const classnames = useMemoClassNames();

  const [value, setValue] = useControllableValue(props, {
    defaultValue: 0,
    defaultValuePropName: "defaultActiveKey",
    valuePropName: "activeKey"
  })

  useRelationPropsInject<ActiveRelationVanSidebarItemProps>(props.pid, (props: VanSidebarItemProps) => {
    return {
      ...props,
      active: value,
      onChange: setValue
    }
  }, [value]);

  return <View className={
    classnames(
      "van-sidebar",
      isExternalClass && "custom-class",
      isNormalClass && props.className
    )
  }>
    {props.children}
  </View>
}
VanSidebar.options = {
  addGlobalClass: true
}
VanSidebar.externalClasses = [
  "custom-class"
]
export default VanSidebar;
