import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import classnames from "classnames";
import { addUnit, CssProperties } from "../common/utils";
import "./index.less";

export type LoadingType = "circular" | "spinner";
export type LoadingProps = {
  type?: LoadingType;
  size?: string | number;
  color?: string;
  vertical?: boolean;
  center?: boolean;
  textSize?: string | number;

  className?: string;
};

const VanLoading: Taro.FunctionComponent<LoadingProps> = (props) => {
  const { type = "circular", vertical, color, size, textSize, center } = props;
  const array12 = Array.from({
    length: 12,
  });

  return (
    <View
      className={classnames(
        props.className,
        "van-loading",
        center && 'van-loading--center',
        vertical && "van-loading--vertical"
      )}
    >
      <View
        className={classnames(
          "van-loading__spinner",
          `van-loading__spinner--${type}`
        )}
        style={CssProperties({
          color: color,
          width: addUnit(size),
          height: addUnit(size),
        })}
      >
        {type === "spinner" &&
          array12.map((_, index) => (
            <View key={index} className="van-loading__dot"></View>
          ))}
      </View>
      <View
        className="van-loading__text"
        style={CssProperties({
          fontSize: addUnit(textSize),
        })}
      >
        {props.children}
      </View>
    </View>
  );
};
VanLoading.options = {
  addGlobalClass: true,
};

export default VanLoading;
