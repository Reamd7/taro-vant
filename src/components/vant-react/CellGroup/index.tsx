import Taro from "@tarojs/taro";
import { Block, View } from "@tarojs/components";
import classNames from "classnames";
import "./index.less";
import { isH5, isWeapp } from "../common/utils";

const VanCellGroup: Taro.FunctionComponent<{
  title?: string;
  border?: boolean;
  className?: string;
  ['custom-class']?: string;
}> = (props) => {
  const { border = true, title } = props;

  return (
    <Block>
      {title && <View className="van-cell-group__title">{title}</View>}
      <View
        className={classNames(
          true && props.className,
          isWeapp && "custom-class",
          "van-cell-group",
          border && "van-hairline--top-bottom"
        )}
      >
        {props.children}
      </View>
    </Block>
  );
};
VanCellGroup.externalClasses = [
  'custom-class'
]
VanCellGroup.options = {
  addGlobalClass: true,
}
export default VanCellGroup;
