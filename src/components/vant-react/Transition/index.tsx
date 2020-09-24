import Taro, { useMemo } from "@tarojs/taro";
import { View } from "@tarojs/components";
import {
  MixinsTransitionProps,
  useMixinsTransition,
  MixinsTransitionExternalClass,
  MixinsTransitionDefaultProps
} from "src/components/vant-react/common/mixins/transition";
import "./index.less";
import { useMemoClassNames, isWeapp, isH5 } from "../common/utils";

const VanTransition: Taro.FunctionComponent<{
  className?: string;
  ["custom-class"]?: string;
  onClick?: React.ComponentProps<typeof View>["onClick"];
  // onTouchMove?: React.ComponentProps<typeof View>["onTouchMove"];
  // useCatchTouch?: boolean;
} & MixinsTransitionProps> = props => {
  const { data, onTransitionEnd } = useMixinsTransition(props, true);
  const classname = useMemoClassNames();
  const { inited, classes, currentDuration, display } = data;
  const ViewClass = useMemo(() => {
    return classname(
      "van-transition",
      classes,
      isH5 && props.className,
      isWeapp && "custom-class"
    );
  }, [classes, isH5 && props.className]);
  const ViewStyle = useMemo(() => {
    return {
      transitionDuration: currentDuration + "ms",
      WebkitTransitionDuration: currentDuration + "ms",
      ...(display
        ? undefined
        : {
            display: "none"
          }),
      ...props.style
    } as React.CSSProperties;
  }, [currentDuration, display , props.style]);
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
VanTransition.defaultProps = MixinsTransitionDefaultProps
VanTransition.options = {
  addGlobalClass: true
};
VanTransition.externalClasses = [
  "custom-class",
  ...MixinsTransitionExternalClass
];
export default VanTransition;
