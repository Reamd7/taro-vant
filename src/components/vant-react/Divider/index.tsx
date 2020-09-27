import Taro from "@tarojs/taro";

import "./index.less";
import {
  useMemoBem,
  useMemoClassNames,
  useMemoCssProperties,
  isWeapp,
  useMemoAddUnit
} from "../common/utils";
import { View } from "@tarojs/components";

export type VanDividerProps = {
  dashed?: boolean;
  hairline?: boolean;
  contentPosition?: "left" | "right" | "center";
  borderColor?: string;
  fontSize?: number;
  textColor?: string;
  customStyle?: React.CSSProperties;

  className?: string;
  ["custom-class"]?: string;
};

const VanDivider: Taro.FunctionComponent<VanDividerProps> = props => {
  const bem = useMemoBem();
  const classnames = useMemoClassNames();
  const css = useMemoCssProperties();
  const addUnit = useMemoAddUnit();
  const { dashed, hairline, contentPosition } = props;
  return (
    <View
      className={classnames(
        isWeapp && "custom-class",
        props.className,
        bem("divider", [{ dashed, hairline }, contentPosition])
      )}
      style={css({
        borderColor: props.borderColor,
        color: props.textColor,
        fontSize: addUnit(props.fontSize),
        ...props.customStyle
      })}
    >
      {props.children}
    </View>
  );
};
VanDivider.options = {
  addGlobalClass: true
};

export default VanDivider;
