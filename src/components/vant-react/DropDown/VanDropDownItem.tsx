import Taro, { useState, useEffect, useRef } from "@tarojs/taro";

import "./VanDropDownItem.less";
import { View, Text } from "@tarojs/components";
import { useMemoBem, ActiveProps, useMemoCssProperties } from "../common/utils";
import VanPopup from "../Popup";
import VanCell from "../Cell";
import { ActiveVanDropDownMenuProps } from "./VanDropDownMenu";
import { useRelationPropsListener } from "../common/relation";
import VanIcon, { VanIconProps } from "../icon";
import usePersistFn from "src/common/hooks/usePersistFn";


export type VanDropDownItemProps = {
  gid: string;

  index: number;
  total: number;

  title?: string;
  disabled?: boolean;
  titleClass?: string;

  value?: string | number;
  options?: Array<{
    value: string | number;
    text: string;
    icon?: VanIconProps['name']
  }>

  popupStyle?: React.CSSProperties;

  onOpen?: VoidFunction;
  onOpened?: VoidFunction;
  onClose?: VoidFunction;
  onClosed?: VoidFunction;

}

const DefaultProps = {
  options: [] as Array<{
    value: string;
    text: string;
    icon?: VanIconProps['name']
  }>
} as const

export type ActiveVanDropDownItemProps = ActiveProps<VanDropDownItemProps, keyof typeof DefaultProps> & (
  Pick<ActiveVanDropDownMenuProps, "overlay" | "duration" | "activeColor" | "closeOnClickOverlay" | "direction">
  & {
    activeIndex: number | null; // 这里的状态 当为undefined时候 => 即主动关闭，当为数字的时候，即切换。
    // 主动关闭是有动画的
    // 切换是没有动画的。
    onChange: (value?: {
      value: string | number;
      text: string;
      icon?: VanIconProps['name']
    }) => void;

    getChildWrapperStyle: () => Promise<React.CSSProperties>
    onFocusClose: VoidFunction
  })

const VanDropDownItem: Taro.FunctionComponent<VanDropDownItemProps> = (props: ActiveVanDropDownItemProps) => {
  const bem = useMemoBem();
  const css = useMemoCssProperties();

  const [showWrapper, setShowWrapper] = useState(false);
  // const [transition, settransition] = useState(true);
  const [wrapperStyle, setWrapperStyle] = useState<React.CSSProperties>()

  const {
    overlay,
    duration,
    activeColor,
    closeOnClickOverlay,
    direction,

    value,     // ==>
    options,   // ==>
    onChange,  // value onChange

    onFocusClose,    // 主动触发关闭状态。

    index,
    activeIndex, // ==> index === active
    getChildWrapperStyle,

  } = useRelationPropsListener(props.gid, props);

  const prevActiveIndex = useRef(activeIndex)

  // ===============================================
  const showPopup = index === activeIndex;

  // const switchPopup = prevActiveIndex.current === index && prevActiveIndex.current !== activeIndex && activeIndex !== null;
  // const transition = !switchPopup
  const transition = prevActiveIndex.current !== index || prevActiveIndex.current === activeIndex || activeIndex === null;
  prevActiveIndex.current = activeIndex;
  // 这里的状态 当为undefined时候 => 即主动关闭，
  // 当为数字的时候，即切换。
  // 主动关闭是有动画的。切换是没有动画的。

  const onShow = usePersistFn(() => {
    getChildWrapperStyle().then((wrapperStyle) => {
      setWrapperStyle(wrapperStyle);
      setShowWrapper(true);
    });
  }, [getChildWrapperStyle])
  useEffect(() => {
    if (showPopup) {
      onShow()
    }
  }, [showPopup]);

  // console.log(showPopup, index, activeIndex, value)

  return showWrapper ? <View
    className={bem('dropdown-item', direction)}
    style={wrapperStyle}
  >
    <VanPopup
      show={showPopup}
      style={css({
        position: 'absolute',
        ...props.popupStyle
      })}
      overlayStyle={css({
        position: 'absolute',
      })}
      // style={wrapperStyle}
      overlay={overlay}
      position={direction === 'down' ? 'top' : 'bottom'}
      duration={transition ? duration : 0}
      closeOnClickOverlay={closeOnClickOverlay}
      onEnter={props.onOpen}
      onLeave={props.onClose}
      onClose={() => {
        onFocusClose(); // 主动关闭自身
      }}
      onAfterEnter={props.onOpened}
      onAfterLeave={() => {
        props.onClosed && props.onClosed();
        setShowWrapper(false)
      }}
    >
      {options.map((item) => {
        return <VanCell
          className={bem('dropdown-item__option', { active: item.value === value })}
          clickable
          icon={item.icon}
          onClick={() => {
            const shouldEmitChange = (item.value !== value);
            if (shouldEmitChange) {
              onChange(item) // 主动call parent 来改变值
            }
            props.onClose && props.onClose()
          }}
          useTitleSlot
          renderTitle={
            <View className="van-dropdown-item__title" style={
              css({
                color: (item.value === value) ? activeColor : ''
              })
            }>
              <Text>{item.text}</Text>
            </View>
          }
          key={item.text}
        >
          {(item.value === value) && <VanIcon
            name="success"
            className="van-dropdown-item__icon"
            color={activeColor}
          />}
        </VanCell>
      })}
      {props.children}
    </VanPopup>
  </View> : null;
}

VanDropDownItem.options = {
  addGlobalClass: true
};
VanDropDownItem.defaultProps = DefaultProps;

export default VanDropDownItem;
