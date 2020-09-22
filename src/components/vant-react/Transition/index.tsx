import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import {
  MixinsTransitionProps,
  useMixinsTransition
} from "src/components/vant-react/common/mixins/transition";
import "./index.less";
import { useMemoClassNames } from "../common/utils";

const VanTransition: Taro.FunctionComponent<{
  className?: string;
  onClick?: React.ComponentProps<typeof View>["onClick"];
  onTouchMove?: React.ComponentProps<typeof View>["onTouchMove"];
} & MixinsTransitionProps> = props => {
  const { data, onTransitionEnd } = useMixinsTransition(props, true);
  const classname = useMemoClassNames();
  const { inited, classes, currentDuration, display } = data;
  return inited ? (
    <View
      className={classname("van-transition", classes, props.className)}
      style={{
        transitionDuration: currentDuration + "ms",
        WebkitTransitionDuration: currentDuration + "ms",
        ...(display
          ? undefined
          : {
              display: "none"
            }),
        ...props.style
      }}
      onClick={props.onClick}
      onTouchMove={props.onTouchMove}
      onTransitionEnd={onTransitionEnd}
    >
      {props.children}
    </View>
  ) : null;
};

VanTransition.options = {
  addGlobalClass: true
};

export default VanTransition;
