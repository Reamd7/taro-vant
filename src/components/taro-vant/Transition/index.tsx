import Taro from "@tarojs/taro";
const { useMemo } = Taro /** api **/;
import { View } from "@tarojs/components";
import {
  MixinsTransitionProps,
  useMixinsTransition,
  MixinsTransitionExternalClass,
  MixinsTransitionDefaultProps
} from "taro-vant/common/mixins/transition";
import "./index.less";
import { useMemoClassNames, isExternalClass, isNormalClass } from "taro-vant/utils"
/**
 * 默认 VanTransition 支持的动画效果
 */
export type VanTransitionName = 'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | ''

export type VanTransitionProps = {
  className?: string;
  ["custom-class"]?: string;
  onClick?: React.ComponentProps<typeof View>["onClick"];
  name?: VanTransitionName
} & Omit<MixinsTransitionProps, "name">;

const VanTransition: Taro.FunctionComponent<VanTransitionProps> = props => {
  const { data, onTransitionEnd } = useMixinsTransition(props, true);
  const classname = useMemoClassNames();
  const { inited, classes, currentDuration, display } = data;
  const ViewClass = useMemo(() => {
    return classname(
      "van-transition",
      classes,
      isNormalClass && props.className,
      isExternalClass && "custom-class"
    );
  }, [classes, isNormalClass && props.className]);
  const ViewStyle = useMemo(() => {
    return {
      transitionDuration: currentDuration + "ms",
      WebkitTransitionDuration: currentDuration + "ms",
      ...(display
        ? {
          display: "block"
        }
        : {
          display: "none"
        }),
      ...props.style
    } as React.CSSProperties;
  }, [currentDuration, display, props.style]);
  return inited ? (
    <View
      className={ViewClass}
      style={ViewStyle}
      onTransitionEnd={onTransitionEnd}
    >
      {props.children}
    </View>
  ) : null;
};
VanTransition.defaultProps = MixinsTransitionDefaultProps;
VanTransition.options = {
  addGlobalClass: true
};
VanTransition.externalClasses = [
  "custom-class",
  ...MixinsTransitionExternalClass
];
export default VanTransition;
