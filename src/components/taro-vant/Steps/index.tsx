import Taro from "@tarojs/taro";
import { View, Block } from "@tarojs/components";
import { ITouchEvent } from "@tarojs/components/types/common";
import VanIcon from "../icon";
import { GREEN, GRAY_DARK } from "../common/color";
import {
  noop,
  useMemoClassNames,
  bem,
  isExternalClass,
  isNormalClass
} from "taro-vant/utils"
import "./index.less";

export type VanStepsProp = {
  active?: number;
  steps: Array<{
    text?: string;
    desc?: string;
    // activeColor?: string;
    // inactiveColor?: string;
    activeIcon?: React.ComponentProps<typeof VanIcon>["name"];
    inactiveIcon?: React.ComponentProps<typeof VanIcon>["name"];
  }>;
  direction?: "horizontal" | "vertical";
  activeColor?: string;
  inactiveColor?: string;
  activeIcon?: React.ComponentProps<typeof VanIcon>["name"];
  inactiveIcon?: React.ComponentProps<typeof VanIcon>["name"];

  className?: string;
  ["custom-class"]?: string;
  descClass?: string;
  ["desc-class"]?: string;

  onClickStep?: (index: number, e: ITouchEvent) => void;
};
function status(index: number, active: number) {
  if (index < active) {
    return "finish";
  } else if (index === active) {
    return "process";
  }

  return "inactive";
}
const VanSteps: Taro.FunctionComponent<VanStepsProp> = props => {
  const {
    steps,
    active = 0,
    direction = "horizontal",
    activeColor = GREEN,
    inactiveColor = GRAY_DARK,
    activeIcon = "checked",
    inactiveIcon,
    onClickStep = noop
  } = props;

  const classname = useMemoClassNames();


  if (!steps) return null
  return (
    <View
      className={classname(
        isExternalClass && "custom-class",
        isNormalClass && props.className,
        bem("steps", [direction])
      )}
    >
      <View className="van-step__wrapper">
        {steps.map((item, index) => {
          return (
            <View
              key={item.text || index}
              onClick={event => {
                onClickStep(index, event);
              }}
              data-index={index}
              className={bem("step", [direction, status(index, active)])}
              style={
                status(index, active) === "inactive"
                  ? {
                      color: inactiveColor
                    }
                  : {
                    // nervjs BUG ISSUSE 这里不能为 undefined
                  }
              }
            >
              <View
                className="van-step__title"
                style={
                  index === active
                    ? {
                        color: activeColor
                      }
                    : {}
                }
              >
                <View>{item.text}</View>
                <View className="desc-class">{item.desc}</View>
              </View>
              <View className=""></View>
              <View className="van-step__circle-container">
                {index !== active ? (
                  <Block>
                    {(item.inactiveIcon || inactiveIcon) ? (
                      <VanIcon
                        color={
                          status(index, active) === "inactive"
                            ? inactiveColor
                            : activeColor
                        }
                        name={item.inactiveIcon || inactiveIcon}
                        className="van-step__icon"
                        custom-class="van-step__icon"
                      />
                    ) : (
                      <View
                        className="van-step__circle"
                        style={{
                          backgroundColor:
                            index < active ? activeColor : inactiveColor
                        }}
                      />
                    )}
                  </Block>
                ) : (
                  <VanIcon
                    name={item.activeIcon || activeIcon}
                    color={activeColor}
                    custom-class="van-step__icon"
                    className="van-step__icon"
                  />
                )}
              </View>
              {index !== steps.length - 1 && (
                <View
                  className="van-step__line"
                  style={{
                    backgroundColor:
                      index < active ? activeColor : inactiveColor
                  }}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

VanSteps.options = {
  addGlobalClass: true
};

VanSteps.externalClasses = ["custom-class", "desc-class"];

export default VanSteps;
