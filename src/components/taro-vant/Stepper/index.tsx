import { Input, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
const { useEffect, useMemo, useRef, useState, useCallback } = Taro /** api **/;
import { isExternalClass, isNormalClass, noop, useMemoAddUnit, bem, useMemoClassNames, CssProperties, ActiveProps } from '../utils';
import { InputProps } from '@tarojs/components/types/Input';
import { BaseEventOrig, CommonEventFunction, ITouchEvent } from '@tarojs/components/types/common';
import Big from 'big.js';
import "./index.less"
import useControllableValue, { ControllerValueProps } from '../hooks/useControllableValue'
const LONG_PRESS_START_TIME = 300;

export type VanStepperProps = {
  min?: number;
  max?: number;
  step?: number;
  integer?: boolean;
  disabled?: boolean;
  disableInput?: boolean;
  inputWidth?: number;
  buttonSize?: number;
  showPlus?: boolean;
  showMinus?: boolean;
  decimalLength?: number;
  disablePlus?: boolean;
  disableMinus?: boolean;
  longPress?: boolean;

  onFocus?: CommonEventFunction<InputProps.inputForceEventDetail>
  onBlur?: CommonEventFunction<InputProps.inputValueEventDetail>
  onOverlimit?: (type: "plus" | "minus") => void;
  onPlus?: (event: ITouchEvent) => void;
  onMinus?: (event: ITouchEvent) => void;

} & {
  ['input-class']?: string;
  inputClass?: string;
  plusClass?: string;
  ['plus-class']?: string;
  minusClass?: string;
  ['minus-class']?: string;
  className?: string;
  ['custom-class']?: string;
} & ControllerValueProps<number>;

const DefaultProps = {
  min: 1,
  max: Infinity,
  step: 1,
  integer: false,
  disabled: false,
  disableInput: false,
  inputWidth: 32,
  buttonSize: 28,
  showPlus: true,
  showMinus: true,
  disablePlus: false,
  disableMinus: false,
  longPress: true
}



type ActiveVanStepperProps = ActiveProps<VanStepperProps, keyof typeof DefaultProps>

const VanStepper: Taro.FunctionComponent<VanStepperProps> = (props: ActiveVanStepperProps) => {
  const {
    min,
    max,
    step,
    integer,
    disabled,
    disableInput,
    inputWidth,
    buttonSize,
    showPlus,
    showMinus,
    decimalLength, // >>>
    disablePlus,
    disableMinus,
    longPress,
  } = props;
  // 根据 filter 进行修正给定的数值。
  const filter = useCallback((testVal: string) => {
    if (integer && testVal.includes(".")) { // 限制输入整数
      testVal = testVal.replace(/\.(.*)/, '')
    }
    let NumVal = Number(testVal);
    if (NumVal < min) {
      NumVal = min
    } else if (NumVal > max) {
      NumVal = max
    }
    if (decimalLength !== undefined) { // 补小数点位数
      NumVal = Number(NumVal.toFixed(decimalLength));
    }
    return NumVal
  }, [integer, min, max, decimalLength]);

  const classnames = useMemoClassNames();

  const addUnit = useMemoAddUnit();
  const css = CssProperties;

  const { defaultValue = 1 } = props
  // 负责将 props.value => currentValue =>
  const [currentValue, setCurrentValue] = useControllableValue(props, {
    defaultValue: props.value === undefined ?
      filter(String(defaultValue)) : filter(String(props.value)),
    onRevert: () => {
      setCurrentValue(currentValue)
      setInputVal(currentValue + "")
    }
  });

  const [inputVal, setInputVal] = useState(String(currentValue)); // 定义一个inputVal 输入框的默认值
  useEffect(() => setInputVal(currentValue + ""), [currentValue])
  // 当实际 currentValue 值变化的时候，响应更新输入框的值。

  // ---- 封装了手动更新以及自动更新，封装了输入框的更新以及具体表单值的更新
  const ChangeValue = useCallback((value: number) => {
    const prevNumber = currentValue;

    if (isNaN(value)) {
      setInputVal(prevNumber + ""); // 还原，不会触发onChange事件。
    } else {
      value = filter("" + value);
      if (prevNumber === value) { // 没有变化，就还原
        setInputVal(prevNumber + "")
      } else {
        setCurrentValue(value)
      }
    }
  }, [
    currentValue,
    filter,
    setCurrentValue,
    setInputVal
  ]);

  // ---- inputVal , 当输入的时候无条件更新，但是不会影响currentValue，也不会触发onChange事件。
  const onInput = useCallback((event: BaseEventOrig<InputProps.inputEventDetail>) => {
    setInputVal(event.detail ? event.detail.value || '' : '');
  }, []);

  // ---- 输入框失去焦点的时候进行值更新
  const onBlur = useCallback((event: BaseEventOrig<InputProps.inputEventDetail>) => {
    ChangeValue(Number(inputVal))
    props.onBlur && props.onBlur(event)
  }, [ChangeValue, props.onBlur, inputVal])

  // ---- 点击事件
  const onTap = useCallback((type: "plus" | "minus") => {
    const isPlus = (type === "plus");
    if (isPlus) {
      if (disabled || disableMinus || currentValue > max) {
        props.onOverlimit && props.onOverlimit(type)
        return;
      }
    } else {
      if (disabled || disableMinus || currentValue < min) {
        props.onOverlimit && props.onOverlimit(type)
        return;
      }
    }

    const activeVal = isNaN(Number(inputVal)) ? currentValue : inputVal;
    const newValue = isPlus ? Big(activeVal).add(step).valueOf() : Big(activeVal).minus(step).valueOf();
    const NumVal = filter(newValue);
    ChangeValue(NumVal);
  }, [disabled, disablePlus, disableMinus, inputVal, min, max, props.onOverlimit, filter, ChangeValue, currentValue]);

  // ====================================================
  // 长按节流事件 ( TODO 有点bug prevNumber 会持续是÷值而不是改变过的值。 )
  const longPressTimer = useRef<number>();
  const longPressCallback = useCallback((activeVal: string | number, type: "plus" | "minus") => {
    const isPlus = (type === "plus");
    longPressTimer.current = setTimeout(() => {
      const newValue = isPlus ? Big(activeVal).add(step).valueOf() : Big(activeVal).minus(step).valueOf();
      if (isPlus) {
        if (disabled || disableMinus || Number(newValue) > max) {
          props.onOverlimit && props.onOverlimit(type)
          if (longPressTimer.current != null) {
            clearTimeout(longPressTimer.current)
          }
          return;
        }
      } else {
        if (disabled || disableMinus || Number(newValue) < min) {
          props.onOverlimit && props.onOverlimit(type)
          if (longPressTimer.current != null) {
            clearTimeout(longPressTimer.current)
          }
          return;
        }
      }
      activeVal = filter(newValue);
      ChangeValue(activeVal);
      longPressCallback(activeVal, type)
    }, LONG_PRESS_START_TIME)
  }, [disabled, disablePlus, disableMinus, inputVal, min, max, props.onOverlimit, filter, ChangeValue])
  const onTouchStart = useCallback((type: "plus" | "minus") => {
    if (!longPress) {
      return;
    }
    if (longPressTimer.current != null) {
      clearTimeout(longPressTimer.current)
    }
    const activeVal = isNaN(Number(inputVal)) ? currentValue : inputVal;
    longPressCallback(activeVal, type);
  }, [longPress, longPressCallback, inputVal, currentValue])
  const onTouchEnd = useCallback(() => {
    if (!longPress) {
      return;
    }
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current as unknown as number)
    }
  }, [longPress])

  const size = useMemo(() => addUnit(buttonSize), [buttonSize]);
  return <View className={classnames(
    'van-stepper',
    isNormalClass && props.className,
    isExternalClass && 'custom-class'
  )}>
    {showMinus && <View
      style={css({
        width: size,
        height: size
      })}
      className={classnames(
        isNormalClass && props.minusClass,
        isExternalClass && 'minus-class',
        bem('stepper__minus', { disabled: disabled || disableMinus || currentValue <= min })
      )}
      hoverClass="van-stepper__minus--hover"
      hoverStayTime={70}
      onClick={(event) => {
        onTap("minus")
        props.onMinus && props.onMinus(event)
      }}
      onTouchStart={() => onTouchStart("minus")}
      onTouchEnd={onTouchEnd}
    />}
    <Input
      type={integer ? 'number' : 'digit'}
      className={classnames(
        isNormalClass && props.inputClass,
        isExternalClass && 'input-class',
        bem('stepper__input', { disabled: disabled || disableInput })
      )}
      style={css({
        width: addUnit(inputWidth),
        height: size
      })}
      value={inputVal}
      // focus={focus}
      disabled={disabled || disableInput}
      onInput={onInput}
      onFocus={props.onFocus || noop}
      onBlur={onBlur}
    />
    {showPlus && <View
      data-type="plus"
      style={css({
        width: size,
        height: size
      })}
      className={classnames(
        isNormalClass && props.minusClass,
        isExternalClass && 'plus-class',
        bem('stepper__plus', { disabled: disabled || disablePlus || currentValue >= max })
      )}
      hoverClass="van-stepper__plus--hover"
      hoverStayTime={70}
      onClick={(event) => {
        onTap("plus")
        props.onPlus && props.onPlus(event)
      }}
      onTouchStart={() => onTouchStart("plus")}
      onTouchEnd={onTouchEnd}
    />}
  </View>
};

VanStepper.options = {
  addGlobalClass: true
};
VanStepper.externalClasses = [
  'input-class', 'plus-class', 'minus-class', 'custom-class'
];
VanStepper.defaultProps = DefaultProps;

export default VanStepper;
