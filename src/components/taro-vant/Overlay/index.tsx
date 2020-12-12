import Taro from "@tarojs/taro";
const { useMemo } = Taro /** api **/;
import VanTransition, { VanTransitionProps } from "../Transition";
import {
  CssProperties,
  noop,
  useMemoClassNames,
  isNormalClass,
  isExternalClass
} from "taro-vant/utils"
import { View } from "@tarojs/components";
import "./index.less";
import { ITouchEvent } from "@tarojs/components/types/common";

export type VanOverlayProps = {
  show?: VanTransitionProps["show"];
  zIndex?: number;
  duration?: VanTransitionProps["duration"];
  className?: string;
  ["custom-class"]?: string;
  style?: React.CSSProperties;
  // noScroll?: boolean; // 这个开关一开就整个遮罩层都无法滚动了。
  // onTouchMove?: React.ComponentProps<typeof View>["onTouchMove"];
  onTouchMove?: (e: WsxTouchEvent) => void
  onClick?: React.ComponentProps<typeof View>["onClick"];
};
type WsxTouchEvent = Omit<ITouchEvent, "preventDefault" | "stopPropagation">

// JSS, 代替Css，使用这种方式动态注入属性以保证自定义组件能够覆盖自定义组件的样式。
const VanOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.7)"
};
const VanOverlay: Taro.FunctionComponent<VanOverlayProps> = props => {
  const css = CssProperties;
  const classnames = useMemoClassNames();
  const Style = useMemo(() => {
    return props.className
      ? css({
        ...props.style,
        zIndex: props.zIndex || 20
      })
      : css({
        ...VanOverlayStyle,
        ...props.style,
        zIndex: props.zIndex || 20
      });
  }, [VanOverlayStyle, props.style, props.zIndex, props.className]);
  return (
    <VanTransition
      className={classnames(isNormalClass && props.className, isExternalClass && "custom-class", "van-overlay")}
      style={Style}
      show={props.show}
      duration={props.duration}
    >
      <View
        onClick={props.onClick || noop}
        className="van-overlay--container"
        onTouchMove={e => {
          e.stopPropagation();
          e.preventDefault();
          props.onTouchMove && props.onTouchMove(e);
        }}
      >
        {props.children}
      </View>
      {/* {props.noScroll ? (

      ) : (
        <View
          onClick={props.onClick || noop}
          className="van-overlay"
          onTouchMove={props.onTouchMove || noop}
        >
          {props.children}
        </View>
      )} */}
    </VanTransition>
  );
};

VanOverlay.options = {
  addGlobalClass: true
};
VanOverlay.externalClasses = ["custom-class"];
export default VanOverlay;
