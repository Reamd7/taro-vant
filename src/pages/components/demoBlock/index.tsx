import Taro from "@tarojs/taro";
import classnames from "classnames";
import { View } from "@tarojs/components";
import "./index.less";

interface DemoBlockProps {
  title?: String;
  padding?: Boolean;
  className?: string;
}

const DemoBlock: Taro.FunctionComponent<DemoBlockProps> = (props) => {
  return (
    <View
      className={classnames(
        props.className,
        "demo-block",
        "van-clearfix",
        props.padding && "demo-block--padding"
      )}
    >
      {props.title && <View className="demo-block__title">{props.title}</View>}
      {props.children}
    </View>
  );
};
DemoBlock.options = {
    addGlobalClass: true
}
export default DemoBlock;
