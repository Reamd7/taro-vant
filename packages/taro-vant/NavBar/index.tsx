import Taro from "@tarojs/taro";
const { useState, useEffect, useMemo } = Taro /** api **/;
import type { ReactNode } from 'react'
import { View, Block, MovableView } from "@tarojs/components";
import {
  noop,
  useMemoClassNames,
  bem,
  getSystemInfoSync,
  useMemoAddUnit,
  nextTick,
  getRect,
  useScopeRef,
  ExtClass
} from "../utils";
import VanIcon from "../icon";
import "./index.less"
export type VanNavBarProps = {
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

const VanNavBar: Taro.FunctionComponent<VanNavBarProps> = props => {
  const {
    title = "",
    leftText = "",
    rightText = "",
    leftArrow = false,
    fixed = false,
    placeholder = false,
    border = true,
    zIndex = 1,
    safeAreaInsetTop = true,
    onClickLeft = noop,
    onClickRight = noop
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

  return (
    <Block>
      {(fixed && placeholder) && (
        <View
          style={{
            height: addUnit(height)
          }}
        />
      )}
      <View
        ref={scoperef}
        className={classnames(
          bem("nav-bar", { fixed }),
          ExtClass(props, "custom-class"),
          border && "van-hairline--bottom"
        )}
        style={{
          ...data.baseStyle,
          ...props.customStyle
        }}
      >
        <View className="van-nav-bar__content">
          <View className="van-nav-bar__left" onClick={onClickLeft}>
            {(leftArrow || leftText) ? (
              <Block>
                {leftArrow && (
                  <VanIcon
                    size={16}
                    name="arrow-left"
                    custom-class="van-nav-bar__arrow"
                    className="van-nav-bar__arrow"
                  />
                )}
                {leftText && (
                  <View
                    className="van-nav-bar__text"
                    hoverClass="van-nav-bar__text--hover"
                    hoverStayTime={70}
                  >
                    { leftText }
                  </View>
                )}
              </Block>
            ) : (
              props.renderLeft
            )}
          </View>
          <View className={
            classnames(
              "van-nav-bar__title van-ellipsis",
              ExtClass(props, "title-class")
            )}>
            {title ? <Block>{title}</Block> : props.renderTitle}
          </View>
          <View className="van-nav-bar__right" onClick={onClickRight}>
            {rightText ? (
              <View
                className="van-nav-bar__text"
                hoverClass="van-nav-bar__text--hover"
                hoverStayTime={70}
              >
                {rightText}
              </View>
            ) : (
              props.renderRight
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
export default VanNavBar;
