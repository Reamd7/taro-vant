import Taro from "@tarojs/taro";
import { useMemo, useCallback, useState, useEffect, useRef } from "react";
import "./index.less";
import { useMemoClassNames, useMemoBem, isExternalClass, isNormalClass, useMemoCssProperties, useMemoAddUnit, getRect, useScope, noop, ActiveProps } from "../common/utils";
import { View } from "@tarojs/components";
import useControllableValue, { ControllerValueProps } from "../../../common/hooks/useControllableValue";
// import { useTouch } from "../common/mixins/touch";
// import { ITouchEvent } from "@tarojs/components/types/common";

export type VanSliderProps = {
  disabled?: boolean
  useButtonSlot?: boolean
  activeColor?: string
  inactiveColor?: string;
  max?: number;
  min?: number;
  step?: number;
  barHeight?: number;

  className?: string;
  'custom-class'?: string;

  renderButton?: React.ReactNode;

  onDragStart?: VoidFunction;
  onDragEnd?: VoidFunction;
  onDrag?: (val: number) => void;


} & ControllerValueProps<number>

const DefaultProps = {
  max: 100,
  min: 0,
  step: 1,
  barHeight: 2,
  disabled: false,
  useButtonSlot: false,
  activeColor: "#1989fa",
  inactiveColor: "#e5e5e5",
} as const

type ActiveVanSliderProps = ActiveProps<VanSliderProps, keyof typeof DefaultProps>

const VanSlider: Taro.FunctionComponent<VanSliderProps> = (props: ActiveVanSliderProps) => {
  const css = useMemoCssProperties();
  const bem = useMemoBem();
  const addUnit = useMemoAddUnit();
  const classname = useMemoClassNames();

  const [value, setValue] = useControllableValue(props, {
    defaultValue: 0
  })

  const [dragValue, setDragValue] = useState(value);
  useEffect(() => setDragValue(value), [value]);

  const getRange = useMemo(() => props.max - props.min, [props.min, props.max]);
  const format = useCallback((value: number) => {
    const max = props.max;
    const min = props.min;
    const step = props.step;
    return Math.round(Math.max(min, Math.min(value, max)) / step) * step;
  }, [props.max, props.min, props.step]);

  const scope = useScope();

  const refW = useRef<Taro.NodesRef.BoundingClientRectCallbackResult>()
  const getRectContainer = useCallback((
    cb: (rect: Taro.NodesRef.BoundingClientRectCallbackResult) => void
  ) => {
    if (!refW.current) {
      getRect(scope, '.van-slider').then(rect => {
        cb(
          refW.current = rect
        )
      })
    } else {
      cb(
        refW.current
      )
    }
  }, [scope])

  const onClick = useCallback((event) => {
    if (props.disabled) return;

    getRectContainer((rect) => {
      const newValue = format(
        ((event.detail.x - rect.left) / rect.width) * getRange + props.min
      );
      setDragValue(newValue);
      setValue(newValue);
    })

  }, [props.disabled, scope, getRange, props.min, format, setValue])

  const onTouchEnd = useCallback(([newValue]: [number]) => {
    setDragValue(newValue);

    setValue(newValue);
    props.onDragEnd && props.onDragEnd()
  }, [props.onDragEnd])

  const click = useCallback(([newValue]: [number]) => {
    setDragValue(newValue);
    setValue(newValue);
  }, [setValue, setDragValue])

  if (scope) {
    scope.onDragStart = (props.onDragStart || noop);
    scope.onDrag = ([v]: [number]) => {
      setDragValue(v)
      props.onDrag && props.onDrag(v)
    };
    scope.onTouchend = onTouchEnd;
    scope.onClick = click;
  }

  const controllcomponent=!!('value' in props);

  return <View className={classname(
    isNormalClass && props.className,
    isExternalClass && 'custom-class',
    bem('slider', { disabled: props.disabled })
  )}
    style={css({
      background: props.inactiveColor
    })}
    // onClick="{{slider.click}}"
    onClick={onClick}
    data-disabled={props.disabled}
    data-value={value}
    data-min={props.min}
    data-max={props.max}
    data-step={props.step}
    data-controllcomponent={controllcomponent}
  >
    <wxs module="slider" src="./slider.wxs" />
    <View
      className="van-slider__bar"
      style={(() => {
        const style: React.CSSProperties = {
          width: `${((dragValue - props.min) * 100) / getRange}%`,
          height: addUnit(props.barHeight),
          background: props.activeColor,
        }
        return style
      })()}
    >
      <View
        className="van-slider__button-wrapper"
        onTouchStart="{{slider.touchstart}}"
        onTouchEnd="{{slider.touchend}}"
        onTouchCancel="{{slider.touchend}}"
        onTouchMove="{{slider.touchmove}}"
      >
        {props.useButtonSlot && props.renderButton}
        <View
          className={props.useButtonSlot ? "" : "van-slider__button"}
        ></View>
      </View>
    </View>
  </View>
}

VanSlider.options = {
  addGlobalClass: true
}

VanSlider.externalClasses = [
  'custom-class'
]
VanSlider.defaultProps = DefaultProps;

export default VanSlider;

