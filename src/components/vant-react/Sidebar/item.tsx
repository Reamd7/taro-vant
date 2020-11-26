import Taro from "@tarojs/taro";
import "./item.less";
import { useMemoBem, useMemoClassNames, isExternalClass, isNormalClass } from "../common/utils";
import { useRelationPropsListener } from "../common/relation";
import { View } from "@tarojs/components";
import VanInfo, { VanInfoProps } from "../info";

export type VanSidebarItemProps = {
  pid: string;
  index: number;
  total: number;

  activeClass?: string;
  'active-class'?: string;
  disabledClass?: string;
  'disabled-class'?: string;
  className?: string;
  'custom-class'?: string;

  dot?: VanInfoProps['dot']
  info?: VanInfoProps['info']
  disabled?: boolean;
  title?: string;

  renderTitle?: React.ReactNode
}

export type ActiveRelationVanSidebarItemProps = VanSidebarItemProps & {
  active: number;
  onChange: (active: number) => void;
}

const VanSidebarItem: Taro.FC<VanSidebarItemProps> = (props) => {
  const bem = useMemoBem();
  const classnames = useMemoClassNames();

  const {
    disabled,
    active,
    index,
    onChange,

    info, dot, title
  } = useRelationPropsListener(props.pid, props) as ActiveRelationVanSidebarItemProps;

  const selected = (index === active);

  return <View
    className={
      classnames(
        isExternalClass && 'custom-class',
        isNormalClass && props.className,
        disabled && (
          isExternalClass && 'disabled-class'
        ),
        disabled && (
          isNormalClass && props.disabledClass
        ),
        selected && (
          isExternalClass && 'active-class'
        ),
        selected && (
          isNormalClass && props.activeClass
        ),
        bem('sidebar-item', { selected, disabled })
      )
    }
    hoverClass="van-sidebar-item--hover"
    hoverStayTime={70}
    onClick={() => {
      if (!disabled) onChange(index)
    }}
  >
    <View className="van-sidebar-item__text">
      {(info !== null || dot) && <VanInfo
        dot={dot}
        info={info}
      />}
      {title ? <View>{title}</View>: props.renderTitle}
    </View>
  </View>
}

VanSidebarItem.options = {
  addGlobalClass: true
}
VanSidebarItem.externalClasses = [
  'active-class', 'disabled-class', 'custom-class'
]

export default VanSidebarItem;
