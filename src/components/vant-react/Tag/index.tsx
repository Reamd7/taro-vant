import Taro, { useMemo } from "@tarojs/taro";

import "./index.less";
import { View } from "@tarojs/components";
import {
  useMemoClassNames,
  isWeapp,
  isH5,
  useMemoBem,
  noop,
  useMemoCssProperties
} from "../common/utils";
import VanIcon from "../icon";

export type VanTagProps = {
  type?: "primary" | "success" | "danger" | "warning";
  size?: "large" | "medium";
  color?: string;
  plain?: boolean;
  round?: boolean;
  mark?: boolean;
  textColor?: string;
  closeable?: boolean;

  className?: string;
  ["custom-class"]?: string;

  onClose?: React.ComponentProps<typeof VanIcon>["onClick"];
};

const VanTag: Taro.FunctionComponent<VanTagProps> = props => {
  const {
    type = "default",
    size,
    color,
    plain = false,
    round = false,
    mark = false,
    textColor = "white",
    closeable = false,
    onClose = noop
  } = props;

  const classnames = useMemoClassNames();
  const bem = useMemoBem();
  const css = useMemoCssProperties()

  const ViewStyle = useMemo(() => {
    let res: React.CSSProperties = {};
    if (color || !plain) {
      res.backgroundColor = color;
    }
    if (textColor || (color && plain)) {
      res.color = textColor || color;
    }
    return css(res);
  }, []);

  return (
    <View
      className={classnames(
        isWeapp && "custom-class",
        isH5 && props.className,
        bem("tag", [type, size, { mark, plain, round }])
      )}
      style={ViewStyle}
    >
      {props.children}
      {closeable && (
        <VanIcon
          name="cross"
          className="van-tag__close"
          custom-class="van-tag__close"
          onClick={onClose}
        />
      )}
    </View>
  );
};

VanTag.options = {
  addGlobalClass: true
};
VanTag.externalClasses = [
  "custom-class"
]
export default VanTag;
