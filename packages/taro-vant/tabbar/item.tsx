import Taro from "@tarojs/taro";
import "./item.less";
import { useRelationPropsListener } from "../utils/relation";
import { bem, useMemoClassNames, isExternalClass, isNormalClass } from "../utils"
import { View } from "@tarojs/components";
import VanIcon, { VanIconProps } from "../icon";
import VanInfo, { VanInfoProps } from "../info";

export type VanTabbarItemProps = {
  icon?: VanIconProps['name']
  dot?: VanInfoProps['dot'];
  info?: VanInfoProps['info']

  renderIcon?: React.ReactNode
  renderActiveIcon?: React.ReactNode

  className?: string;
  ['custom-class']?: string;

  pid: string;
  index: number;
  name?: string;
  total: number;
}

export type ActiveRelationVanTabbarItemProps = VanTabbarItemProps & {

  activeColor: string;
  inActiveColor: string;
  activeIndex: string | number;
  onChange: (activeIndex: string | number) => void
}

const VanTabbarItem: Taro.FunctionComponent<VanTabbarItemProps> = (props) => {
  const {
    activeIndex,
    index,
    activeColor,
    inActiveColor,
    onChange
  } = useRelationPropsListener(props.pid, props) as ActiveRelationVanTabbarItemProps;


  const classnames = useMemoClassNames();

  const name = (props.name == null ? index : props.name);
  const active = (activeIndex === name);

  return <View
    className={
      classnames(
        bem('tabbar-item', { active }),
        isNormalClass && props.className,
        isExternalClass && 'custom-class'
      )
    }
    style={{
      color: active ? activeColor : inActiveColor
    }}

    onClick={() => {
      onChange(name);
    }}
  >
    <View
      className="van-tabbar-item__icon"
    >
      {
        props.icon ? <VanIcon
          name={props.icon} className="van-tabbar-item__icon__inner" custom-class="van-tabbar-item__icon__inner"
        /> : (active ? props.renderActiveIcon : props.renderIcon)
      }
      <VanInfo
        dot={props.dot}
        info={props.info}
        className="van-tabbar-item__info"
        custom-class="van-tabbar-item__info"
      />
    </View>
    <View className="van-tabbar-item__text">
      {props.children}
    </View>
  </View>
}

VanTabbarItem.options = {
  addGlobalClass: true
}
VanTabbarItem.externalClasses = [
  'custom-class'
]

export default VanTabbarItem;
