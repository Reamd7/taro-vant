import Taro from "@tarojs/taro";

import "./index.less";
import {
  bem,
  useMemoClassNames,
  CssProperties,
  useMemoAddUnit,
  isExternalClass,
  isNormalClass
} from "../utils"
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

  const classnames = useMemoClassNames();
  const css = CssProperties;
  const addUnit = useMemoAddUnit();
  const { dashed, hairline, contentPosition } = props;
  return (
    <View
      className={classnames(
        isExternalClass && "custom-class",
        isNormalClass && props.className,
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
VanDivider.externalClasses = [
  'custom-class'
]
export default VanDivider;
