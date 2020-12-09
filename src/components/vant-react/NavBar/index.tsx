import Taro from "@tarojs/taro";
import { useState, useEffect, useMemo } from 'react'
import { ReactNode } from "react";
import { View, Block } from "@tarojs/components";
import {
  noop,
  useMemoClassNames,
  useMemoBem,
  getSystemInfoSync,
  useMemoAddUnit,
  useScope,
  isExternalClass,
  isNormalClass
} from "src/components/vant-react/common/utils";
import VanIcon from "src/components/vant-react/icon";
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
  const bem = useMemoBem();
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
  const scope = useScope();
  useEffect(() => {
    if (!fixed || placeholder) {
      return;
    }
    Taro.nextTick(() => {
      scope
        .getRect(".van-nav-bar")
        .then((res: WechatMiniprogram.BoundingClientRectCallbackResult) => {
          setHeight(res.height);
        });
    });
  }, [fixed, placeholder]);

  return (
    <Block>
      {fixed && placeholder && (
        <View
          style={{
            height: addUnit(height)
          }}
        />
      )}
      <View
        className={classnames(
          bem("nav-bar", { fixed }),
          isExternalClass && "custom-class",
          isNormalClass && props.className,
          border && "van-hairline--bottom"
        )}
        style={{
          ...data.baseStyle,
          ...props.customStyle
        }}
      >
        <View className="van-nav-bar__content">
          <View className="van-nav-bar__left" onClick={onClickLeft}>
            {leftArrow || leftText ? (
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
          <View className="van-nav-bar__title title-class van-ellipsis">
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
