import Taro from "@tarojs/taro";
import { useEffect, useState, useRef } from '@tarojs/taro' /** api **/;
import "./VanCollapseItem.less";
import { VanIconProps } from "../icon";
import { ActiveProps, useMemoBem, useMemoClassNames, getRect, useScopeRef, isNormalClass, isExternalClass } from "../common/utils";
import { View } from "@tarojs/components";
import VanCell, { VanCellProps } from "../Cell";
import { useRelationPropsListener } from "../common/relation";
import usePersistFn from "src/common/hooks/usePersistFn";

export type VanCollapseItemProps = {
  name?: string;
  title?: VanCellProps['title']
  icon?: VanIconProps['name'];
  value?: string | number;
  label?: string;
  border?: boolean;
  isLink?: boolean;
  clickable?: boolean;
  disabled?: boolean;

  children?: React.ReactNode;
  renderValue?: React.ReactNode;
  renderIcon?: React.ReactNode;
  renderTitle?: React.ReactNode;
  renderRightIcon?: React.ReactNode;

  className?: string;
  'custom-class'?: string;
  contentClass?: string;
  'content-class'?: string;

  index: number;
  total: number;
  pid: string;
}

const DefaultProps = {
  border: true,
  isLink: true,
  clickable: false,
  disabled: false,
}

export type ActiveVanCollapseItemProps = ActiveProps<VanCollapseItemProps, keyof typeof DefaultProps>

export type ActiveRelationVanCollapseItemProps = ActiveProps<VanCollapseItemProps, keyof typeof DefaultProps> & {
  expanded: boolean,
  onChange: (value: boolean) => void
}

export const VanCollapseItem: Taro.FunctionComponent<VanCollapseItemProps> = (props: ActiveVanCollapseItemProps) => {
  const bem = useMemoBem();
  const classnames = useMemoClassNames();

  const {
    expanded,
    onChange
  } = useRelationPropsListener<ActiveVanCollapseItemProps>(props.pid, props) as ActiveRelationVanCollapseItemProps

  // const [expanded, setExpanded] = useControllableValue(_props, {
  //   defaultValue: false,
  //   defaultValuePropName: "defaultExpanded",
  //   valuePropName: "expanded"
  // })

  const disabled = props.disabled

  const animation = useRef(
    Taro.createAnimation({
      duration: 0,
      timingFunction: 'ease-in-out',
    })
  )
  const [animationStyle, setAnimationStyle] = useState(
    {}
  )

  const inited = useRef(false);
  const [scope, scopeRef] = useScopeRef();

  const updateStyle = usePersistFn((expanded: boolean) => {
    getRect(scope, '.van-collapse-item__content').then(
      ({ height }) => {
        if (expanded) {
          if (height === 0) {
            setAnimationStyle({
              transition: "all 300ms ease-in-out",
              height: "auto",
              top: "1px"
            })
          } else {
            setAnimationStyle({
              transition: "all 300ms ease-in-out",
              height: height,
              top: "1px"
            })
          }
          return;
        } else {
          setAnimationStyle({
            transition: "all 300ms ease-in-out",
            height: 0,
            top: "0px"
          })
        }
      }
    )
  }, [scope, animation])

  useEffect(() => {
    if (scope) {
      updateStyle(expanded);
      inited.current = true;
    }
  }, [expanded, scope])

  return <View className={
    classnames(
      "van-collapse-item van-cell",
      isExternalClass && 'custom-class',
      isNormalClass && props.className,
      props.index !== 0 ? 'van-hairline--top' : ''
    )
  } ref={scopeRef}>
    <View
      className={bem('collapse-item__title', { disabled, expanded })}
    >
      <VanCell
        title={props.title}
        titleClass={"title-class"}
        title-class="title-classs"
        icon={props.icon}
        value={props.value}
        label={props.label}
        isLink={props.isLink}
        clickable={props.clickable}
        border={props.border && expanded}
        className={
          classnames(
            "van-cell",

          )
        }
        custom-class={
          classnames(
            "van-cell",
          )
        }
        rightIconClass="van-cell__right-icon"
        right-icon-class="van-cell__right-icon"
        hover-class="van-cell--hover"
        hoverClass="van-cell--hover"
        onClick={() => {
          if (disabled) return;
          onChange(!expanded);
        }}
        useTitleSlot={!props.title}
        renderTitle={props.renderTitle}
        renderIcon={props.renderIcon}
        renderRightIcon={props.renderRightIcon}
      >
        {props.renderValue}
      </VanCell>
    </View>
    <View
      className={bem('collapse-item__wrapper')}
      style={expanded ? {
        ...animationStyle
      } : { height: 0, ...animationStyle }}
    >
      <View
        className={classnames(
          "van-collapse-item__content",
          isExternalClass && "content-class",
          isNormalClass && props.contentClass
        )}
      >
        {props.children}
      </View>
    </View>
  </View>
}

VanCollapseItem.externalClasses = [
  'custom-class', 'title-class', 'content-class'
]
VanCollapseItem.defaultProps = DefaultProps
VanCollapseItem.options = {
  addGlobalClass: true
}

export default VanCollapseItem
