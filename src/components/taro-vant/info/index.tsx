import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.less";
import { useMemoClassNames, isExternalClass, isNormalClass } from "taro-vant/utils"

export type VanInfoProps = {
  dot?: boolean;
  info?: string | number;
  className?: string;
  ["custom-class"]?: string;
  customStyle?: string | React.CSSProperties;
  // badge?: string | number;
};

const VanInfo: Taro.FunctionComponent<VanInfoProps> = function(props: VanInfoProps) {
  const classnames = useMemoClassNames();
  return (props.info != null && props.info !== "") || props.dot ? (
    <View
      className={classnames(
        isNormalClass && props.className,
        isExternalClass && "custom-class",
        "van-info",
        props.dot && "van-info--dot"
      )}
      style={props.customStyle}
    >
      <Text>{props.dot ? "" : props.info}</Text>
    </View>
  ) : null;
};
VanInfo.externalClasses = [
  "custom-class"
]
VanInfo.options = {
  addGlobalClass: true
};

export default VanInfo;
