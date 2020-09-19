import { View, Text } from "@tarojs/components";
import classnames from 'classnames';
import Taro from "@tarojs/taro";
import "./index.less";
export type InfoProps = {
  dot?: boolean;
  info?: string | number;
  className?: string;
  style?: string | React.CSSProperties;
  // badge?: string | number;
};

const VanInfo: Taro.FunctionComponent<InfoProps> = function (props: InfoProps) {
  return (
    props.info !== null && props.info !== '' || props.dot
  ) ? <View 
        className={classnames(
          props.className,
          'van-info',
          props.dot && 'van-info-dot'
        )}
        style={props.style}
      >
      <Text>{props.dot ? "" : props.info}</Text>
    </View> : null;
}

VanInfo.options = {
  addGlobalClass: true,
}

export default VanInfo;