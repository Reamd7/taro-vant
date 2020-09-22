import Taro from "@tarojs/taro";
import VanTransition from "../Transition";
import {
  useMemoCssProperties, useMemoClassNames
} from "../common/utils";
import { View } from "@tarojs/components";
import "./index.less";

type VanOverlayProps = {
  show?: boolean;
  zIndex?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;

  onClick?: React.ComponentProps<typeof View>['onClick']
};

const VanOverlay: Taro.FunctionComponent<VanOverlayProps> = props => {
  const css = useMemoCssProperties();
  const classnames = useMemoClassNames();
  return (
    <VanTransition
      show={props.show}
      className={classnames('van-overlay', props.className)}
      style={css({
        zIndex: props.zIndex,
        ...props.style
      })}
      duration={props.duration}
      onClick={props.onClick}
      onTouchMove={(e) => {
        e.stopPropagation()
      }}
    >
      {props.children}
    </VanTransition>
  );
};

VanOverlay.options = {
  addGlobalClass: true,
};

export default VanOverlay;
