import Taro from "@tarojs/taro";

import "./VanCollapse.less";
import useControllableValue, { ControllerValueProps } from "taro-vant/hooks/useControllableValue"
import { ActiveProps, useMemoClassNames, noop, isExternalClass, isNormalClass } from "taro-vant/utils"
import { View } from "@tarojs/components";
import { useRelationPropsInject } from "taro-vant/utils/relation";
import { ActiveVanCollapseItemProps, ActiveRelationVanCollapseItemProps } from "./VanCollapseItem";

export type VanCollapseProps = {
  accordion?: boolean;
  border?: boolean;

  onOpen?: (activeName: string | number) => void;
  onClose?: (activeName: string | number) => void;

  'custom-class'?: string;
  className?: string;

  pid: string;
} & ControllerValueProps<Array<string | number>>

const DefaultProps = {
  border: true,
  accordion: false,
  onOpen: noop,
  onClose: noop,
}

export type ActiveVanCollapseProps = ActiveProps<VanCollapseProps, keyof typeof DefaultProps>;

const VanCollapse: Taro.FunctionComponent<VanCollapseProps> = (props: ActiveVanCollapseProps) => {
  const classnames = useMemoClassNames();

  const [value, setValue] = useControllableValue(props, {
    defaultValue: [] as Array<string | number>
  });
  const { accordion, onOpen, onClose } = props;


  useRelationPropsInject<ActiveRelationVanCollapseItemProps>(props.pid, (props: ActiveVanCollapseItemProps) => {
    const name = props.name == null ? props.index : props.name; // 得到 name
    const expanded = value.includes(name);

    const newProps: ActiveRelationVanCollapseItemProps = {
      ...props,
      expanded,
      onChange: (NewExpanded: boolean) => {
        if (expanded === NewExpanded) {
          // onRevert()
        } else {
          // onChange
          if (NewExpanded === true) {
            onOpen(name);
            // open
            if (accordion) { // 联动性
              setValue([name])
            } else {
              setValue([...value, name])
            }
          } else {
            onClose(name)
            // close
            if (accordion) { // 联动性
              setValue([])
            } else {
              setValue(value.filter(v => v !== name))
            }
          }
        }
      }
    }
    return newProps
  }, [
    value, accordion
  ])

  return <View
    className={
      classnames(
        isExternalClass && 'custom-class',
        isNormalClass && props.className,
        'van-collapse',
        props.border && 'van-hairline--top-bottom'
      )
    }
  >
    {props.children}
  </View>
}

VanCollapse.externalClasses = [
  'custom-class',
]
VanCollapse.options = {
  addGlobalClass: true
}
VanCollapse.defaultProps = DefaultProps;

export default VanCollapse
