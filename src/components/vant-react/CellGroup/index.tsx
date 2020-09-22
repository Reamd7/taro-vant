import Taro from "@tarojs/taro";
import { Block, View } from "@tarojs/components";
import classNames from "classnames";
import "./index.less";

const VanCellGroup: Taro.FunctionComponent<{
  title?: string;
  border?: boolean;
  className?: string;
}> = (props) => {
  const { border = true, title } = props;

  return (
    <Block>
      {title && <View className="van-cell-group__title">{title}</View>}
      <View
        className={classNames(
          props.className,
          "van-cell-group",
          border && "van-hairline--top-bottom"
        )}
      >
        {props.children}
      </View>
    </Block>
  );
};

export default VanCellGroup;
