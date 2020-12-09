import Taro from "@tarojs/taro";
import { useMemo } from '@tarojs/taro' /** api **/
import VanTransition, { VanTransitionProps } from "../Transition";
import {
  useMemoCssProperties,
  noop,
  useMemoClassNames,
  isNormalClass,
  isExternalClass,
  useScopeRef
} from "../common/utils";
import { View } from "@tarojs/components";
import "./index.less";
import usePersistFn from "src/common/hooks/usePersistFn";
import { ITouchEvent } from "@tarojs/components/types/common";

type WsxTouchEvent = Omit<ITouchEvent, "preventDefault" | "stopPropagation">

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
  const css = useMemoCssProperties();
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

  const [scope] = useScopeRef();
  const onTouchMove = usePersistFn((e: WsxTouchEvent) => {
    // e.stopPropagation();
    props.onTouchMove && props.onTouchMove(e)
  }, [props.onTouchMove])
  if (scope) {
    scope.onTouchMove = onTouchMove
  }

  return (
    <VanTransition
      className={classnames(isNormalClass && props.className, isExternalClass && "custom-class", "van-overlay")}
      style={Style}
      show={props.show}
      duration={props.duration}
    >
      <wxs module="overlay" src="./overlay.wxs" ></wxs>
      <View
        onClick={props.onClick || noop}
        className="van-overlay--container"
        onTouchMove="{{overlay.touchmove}}" // 触摸overlay遮罩层的时候不会影响下面的滚动。但是好像不能隔离
      >
        {props.children}
      </View>
      {/* {props.noScroll ? (
        <View
          onClick={props.onClick || noop}
          className="van-overlay"
          onTouchMove="{{overlay.touchmove}}"
        >
          {props.children}
        </View>
      ) : (
          <View
            onClick={props.onClick || noop}
            className="van-overlay"
            onTouchMove={onTouchMove}
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
