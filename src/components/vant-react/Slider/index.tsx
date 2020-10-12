import Taro from "@tarojs/taro";
import "./index.less";
import { useMemoClassNames, useMemoBem, isH5, isWeapp, useMemoCssProperties } from "../common/utils";
import { View } from "@tarojs/components";

export type VanSliderProps = {
  disabled?: boolean
  useButtonSlot?: boolean
  activeColor?: string
  inactiveColor?: string;
  max?: number;
  min?: number;
  step?: number;
  value?: number
  barHeight?: number;

  className?: string;
  'custom-class'?: string;

  renderButton?: React.ReactNode;
}

const VanSlider = (props: VanSliderProps) => {

  const {
    max = 100,
    min = 0,
    step = 1,
    barHeight = 2
  } = props;

  const css = useMemoCssProperties();
  const bem = useMemoBem();
  const classname = useMemoClassNames();

  return <View className={
    classname(
      isH5 && props.className,
      isWeapp && 'custom-class',
      bem('slider', { disabled: props.disabled })
    )
  }
    style={css({
      background: props.inactiveColor
    })}

    onClick={onClick}
  >
    <View
      className="van-slider__bar"
      style={{
        ...barStyle,
        ...barStyle(barHeight, activeColor)
      }}
    >
      <View
        className="van-slider__button-wrapper"
        onTouchStart="onTouchStart"
        onTouchEnd="onTouchEnd"
        onTouchCancel="onTouchEnd"
        onTouchMove={e => {
          e.stopPropagation(
            "onTouchMove"
          )
        }}
      >
        {props.useButtonSlot ? props.renderButton : <View
          className="van-slider__button"
        />}
      </View>
    </View>
  </View >
}
