import Taro from "@tarojs/taro";
const { useState, useEffect, useMemo } = Taro /** api **/;
import type { ReactNode } from 'react'
import { View, Block, Text } from "@tarojs/components";
import {
  noop,
  useMemoClassNames,
  bem,
  getSystemInfoSync,
  useMemoAddUnit,
  nextTick,
  getRect,
  useScopeRef,
  ExtClass,
  ActiveProps
} from "../utils";
import VanIcon from "../icon";
import "./index.less"
export type VanNavBarProps = {
  titleAlign?: "absolute" | "flex";
  title?: string;
  leftText?: string;
  rightText?: string;
  leftArrow?: boolean;
  fixed?: boolean;
  placeholder?: boolean;
  border?: boolean;
  zIndex?: number;
  customStyle?: React.CSSProperties;
  safeAreaInsetTop?: boolean;

  renderTitle?: ReactNode;
  renderLeft?: ReactNode;
  renderRight?: ReactNode;

  onClickLeft?: React.ComponentProps<typeof View>["onClick"];
  onClickRight?: React.ComponentProps<typeof View>["onClick"];
  className?: string;
  ["custom-class"]?: string;
  titleClass?: string;
  ["title-class"]?: string;
};
const DefaultProps = {
  titleAlign : "absolute" as "absolute",
  title : "",
  leftText : "",
  rightText : "",
  leftArrow : false,
  fixed : false,
  placeholder : false,
  border : true,
  zIndex : 1,
  safeAreaInsetTop : true,
  onClickLeft : noop,
  onClickRight : noop
}
type ActiveVanNavBarProps = ActiveProps<VanNavBarProps, keyof typeof DefaultProps>

const VanNavBar: Taro.FunctionComponent<VanNavBarProps> = (props: ActiveVanNavBarProps) => {
  const {
    title,
    leftText,
    rightText,
    leftArrow,
    fixed,
    placeholder,
    border,
    zIndex,
    safeAreaInsetTop,
    onClickLeft,
    onClickRight
  } = props;

  const classnames = useMemoClassNames();

  const addUnit = useMemoAddUnit();

  const { statusBarHeight } = getSystemInfoSync();
  const paddingTop = safeAreaInsetTop ? statusBarHeight : 0;
  const [height, setHeight] = useState(44 + statusBarHeight);
  const data = useMemo(()=>{
    return {
      statusBarHeight,
      baseStyle: {
        zIndex,
        paddingTop: addUnit(paddingTop)
      }
    } as {
      statusBarHeight: number;
      baseStyle: React.CSSProperties;
    }
  }, [statusBarHeight, zIndex, paddingTop])
  const [scope, scoperef] = useScopeRef();
  useEffect(() => {
    if (!fixed || placeholder) {
      return;
    }
    nextTick(() => {
      getRect(".van-nav-bar", scope)
        .then((res: WechatMiniprogram.BoundingClientRectCallbackResult) => {
          setHeight(res.height);
        });
    });
  }, [fixed, placeholder]);

  const fixedHeight = useMemo(()=> ({
    height: addUnit(height)
  }), [height, addUnit]);

  const navBarStyle = useMemo(()=>({
    ...data.baseStyle,
    ...props.customStyle
  }), [data.baseStyle, props.customStyle]);

  return (
    <Block>
      {(fixed && placeholder) && ( <View style={fixedHeight} /> )}
      <View
        ref={scoperef}
        className={classnames(
          bem("nav-bar", { fixed }),
          ExtClass(props, "custom-class"),
          border && "van-hairline--bottom"
        )}
        style={navBarStyle}
      >
        <View className="van-nav-bar__content">
          <View
            className={
              classnames(
                "van-nav-bar__left",
                props.titleAlign === "absolute" && "van-nav-bar__left--absolute"
              )
            }
          >
            {(leftArrow || leftText) ? (
              <View className='van-nav-bar__action' hoverClass='van-nav-bar__action--hover' onClick={onClickLeft}>
                {leftArrow && (
                  <VanIcon
                    size={16}
                    name="arrow-left"
                    custom-class="van-nav-bar__arrow"
                    className="van-nav-bar__arrow"
                  />
                )}
                {leftText && (
                  <Text className="van-nav-bar__text">{ leftText }</Text>
                )}
              </View>
            ) : (
              <View className="slot van-nav-bar__action" hoverClass='van-nav-bar__action--hover' hoverStayTime={70} onClick={onClickLeft}>{props.renderLeft}</View>
            )}
          </View>
          <View className={
            classnames(
              "van-nav-bar__title van-ellipsis",
              props.titleAlign === "absolute" && "van-nav-bar__title--absolute",
              ExtClass(props, "title-class")
            )}>
            {title ? <Text className='van-nav-bar__title__text'>
              {title}
            </Text> : <View className="slot">{props.renderTitle}</View>}
          </View>
          <View
            className={
              classnames(
                "van-nav-bar__right",
                props.titleAlign === "absolute" && "van-nav-bar__right--absolute"
              )
            }
          >
            {rightText ? (
              <View className='van-nav-bar__action' hoverClass='van-nav-bar__action--hover' hoverStayTime={70} onClick={onClickRight}>
                <Text className="van-nav-bar__text">{rightText}</Text>
              </View>
            ) : (
              <View className="slot van-nav-bar__action" hoverClass='van-nav-bar__action--hover' hoverStayTime={70} onClick={onClickRight}>{props.renderRight}</View>
            )}
          </View>
        </View>
      </View>
    </Block>
  );
};
VanNavBar.options = {
  addGlobalClass: true
};
VanNavBar.externalClasses = [
  "custom-class",
  "title-class"
]
VanNavBar.defaultProps = DefaultProps;
export default VanNavBar;
