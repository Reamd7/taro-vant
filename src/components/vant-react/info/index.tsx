import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.less";
import { useMemoClassNames, isH5, isWeapp } from "../common/utils";

export type InfoProps = {
  dot?: boolean;
  info?: string | number;
  className?: string;
  ["custom-class"]?: string;
  customStyle?: string | React.CSSProperties;
  // badge?: string | number;
};

const VanInfo: Taro.FunctionComponent<InfoProps> = function(props: InfoProps) {
  const classnames = useMemoClassNames();
  return (props.info != null && props.info !== "") || props.dot ? (
    <View
      className={classnames(
        isH5 && props.className,
        isWeapp && "custom-class",
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
