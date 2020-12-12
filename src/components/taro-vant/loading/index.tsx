import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import classnames from "classnames";
import { useMemoAddUnit, CssProperties, isExternalClass, isNormalClass } from "taro-vant/utils"
import "./index.less";

export type LoadingType = "circular" | "spinner";
export type VanLoadingProps = {
  type?: LoadingType;
  size?: string | number;
  color?: string;
  vertical?: boolean;
  center?: boolean;
  textSize?: string | number;
  className?: string;
  ['custom-class']?: string;
};
const array12 = Array.from({
  length: 12,
}).map((_, i) => i);
const VanLoading: Taro.FunctionComponent<VanLoadingProps> = (props) => {
  const { type = "circular", vertical, color, size, textSize, center } = props;
  const addUnit = useMemoAddUnit()

  return (
    <View
      className={classnames(
        isNormalClass && props.className,
        isExternalClass && "custom-class",
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
          array12.map((i) => (
            <View className='van-loading__dot' key={i}></View>
          ))}
      </View>
      <View
        className='van-loading__text'
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
VanLoading.externalClasses = [
  'custom-class'
]
export default VanLoading;
