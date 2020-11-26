import Taro from "@tarojs/taro";

import "./index.less";
import { BLUE } from "../common/color";
import { View } from "@tarojs/components";
import {
  useMemoClassNames,
  useMemoAddUnit,
  useMemoCssProperties,
  isExternalClass,
  isNormalClass
} from "../common/utils";

export type VanProgressProps = {
  inactive?: boolean;
  percentage?: string | number;
  pivotText?: string;
  pivotColor?: string;
  trackColor?: string;

  showPivot?: boolean;
  color?: string;
  textColor?: string;
  strokeWidth?: string | number;

  className?: string;
  ["custom-class"]?: string;
};
function text(pivotText: string | undefined, percentage: string | number) {
  return pivotText || percentage + "%";
}
const VanProgress: Taro.FunctionComponent<VanProgressProps> = props => {
  const {
    inactive = false,
    percentage = 0,
    pivotColor,
    pivotText,
    trackColor = "#e5e5e5",
    showPivot = true,
    color = BLUE,
    textColor = "#fff",
    strokeWidth = 4
  } = props;
  const classname = useMemoClassNames();
  const addUnit = useMemoAddUnit();
  const css = useMemoCssProperties();
  const getterstext = text(pivotText, percentage);
  return (
    <View
      className={classname(
        "van-progress",
        isExternalClass && "custom-class",
        isNormalClass && props.className
      )}
      style={css({
        height: addUnit(strokeWidth),
        background: trackColor
      })}
    >
      <View
        className="van-progress__portion"
        style={css({
          width: `${percentage}%`,
          background: inactive ? "#cacaca" : color
        })}
      >
        {showPivot && getterstext && (
          <View
            className="van-progress__pivot"
            style={css({
              color: textColor,
              background: pivotColor ? pivotColor : inactive ? "#cacaca" : color
            })}
          >
            {getterstext}
          </View>
        )}
      </View>
    </View>
  );
};

VanProgress.options = {
  addGlobalClass: true
};

VanProgress.externalClasses = [
  "custom-class"
];

export default VanProgress;
