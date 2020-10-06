import { Input, View } from '@tarojs/components';
import Taro, { useEffect, useMemo, useRef, useState, useCallback } from '@tarojs/taro';
import { isH5, isWeapp, noop, useMemoAddUnit, useMemoBem, useMemoClassNames, useMemoCssProperties } from '../common/utils';
import { FormField, useFormItem } from "../common/formitem";
import { InputProps } from '@tarojs/components/types/Input';
import { BaseEventOrig, CommonEventFunction, ITouchEvent } from '@tarojs/components/types/common';
import Big from 'big.js';
import "./index.less"
const LONG_PRESS_START_TIME = 600;
export type VanStepperProps<Key extends string> = {
  value?: number
  min?: number;
  max?: number;
  step?: number;
  integer?: boolean;
  disabled?: boolean;
  disableInput?: boolean;
  manualChange?: boolean;
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
  onChange?: (action: {
    prevNumber: number;
    value: number;
    // setCurrentValue: (val: number) => void;
    updateValue: VoidFunction;
    revertValue: VoidFunction;
  }) => void;
} & {
  ['input-class']?: string;
  inputClass?: string;
  plusClass?: string;
  ['plus-class']?: string;
  minusClass?: string;
  ['minus-class']?: string;
  className?: string;
  ['custom-class']?: string;
} & FormField<Key, number>;

const VanStepper = <T extends string>(props: VanStepperProps<T>) => {
  const {
    min = 1,
    max = Infinity,
    step = 1,
    integer = false,
    disabled = false,
    disableInput = false,
    manualChange = false, // 手动触发Change，需要外部通过修改value 以修改表单内部的值。
    inputWidth = 32,
    buttonSize = 28,
    showPlus = true,
    showMinus = true,
    decimalLength,
    disablePlus = false,
    disableMinus = false,
    longPress = true,
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
  const bem = useMemoBem();
  const addUnit = useMemoAddUnit();
  const css = useMemoCssProperties();

  const {
    fieldName,
    FormData,
    value = props.value === undefined ? undefined : filter(String(props.value)),
    defaultValue = 1,
  } = props
  // 负责将 props.value => currentValue =>
  const [currentValue, setCurrentValue] = useFormItem({
    fieldName,
    FormData,
    value, // 把受控value值经过过滤传递到内部。
    defaultValue: filter(String(defaultValue)),
  });

  const [inputVal, setInputVal] = useState(String(currentValue)); // 定义一个inputVal 输入框的默认值
  useEffect(() => {
    setInputVal(currentValue + "")
  }, [currentValue, decimalLength]) // 当实际currentValue值变化的时候，响应更新输入框的值。

  // inputVal , 当输入的时候无条件更新，但是不会影响currentValue，也不会触发onChange事件。
  const onInput = useCallback((event: BaseEventOrig<InputProps.inputEventDetail>) => {
    const { value = '' } = event.detail || {};
    setInputVal(value);
  }, []);
  // 封装了手动更新以及自动更新，封装了输入框的更新以及具体表单值的更新
  const ChangeValue = useCallback((value: number) => {
    const prevNumber = currentValue;

    if (isNaN(value)) {
      setInputVal(prevNumber + ""); // 还原，不会触发onChange事件。
    } else {
      value = filter("" + value);

      if (manualChange && props.onChange) {
        // NOTE : 这里如果也允许手动更新。小心一个情况就是onChange没有修改值的时候要怎么操作？
        props.onChange({
          prevNumber,
          value,
          // setCurrentValue,
          // 暴露组件内部的修改的操作 => 目的是兼容两种不同的fromRef，如果是用FormState, 则正常来说可不需要这个函数，也可以同步innerValue 和 state的 value。但是如果用 FromRef，则 可以通过这个函数一步操作修改innerValue 以及 外部的FormRef。
          // 但是有一个问题，就是这个函数是底层的，没有经过校验的？所以可以用一个封装好的函数进行处理？
          updateValue: () => {
            if (prevNumber === value) {
              setInputVal(prevNumber + "") // 如果没有修改成功但是inputVal又修改了的情况下，需要还原
            } else {
              setCurrentValue(value)
            }
          },
          revertValue: () => {
            // 没有进行自动更新，所以不需要还原 currentValue 值
            setInputVal(String(prevNumber))
          }
        })
      } else {
        if (prevNumber === value) {
          setInputVal(prevNumber + "")
        } else {
          console.log(prevNumber, value)
          setCurrentValue(value)
        }
        // 先进行自动更新
        props.onChange && Taro.nextTick(() => {
          props.onChange && props.onChange({
            prevNumber,
            value,
            // setCurrentValue,
            updateValue: noop, // TODO 可以加一个devtool时的提示。
            revertValue: () => {
              // 没有进行自动更新，所以不需要还原 currentValue 值
              setInputVal(String(prevNumber))
            }
          })
        })
      }
    }
  }, [
    manualChange,
    currentValue,
    props.onChange,
    filter,
    setCurrentValue,
    setInputVal
  ]);
  // 输入框失去焦点的时候进行值更新
  const onBlur = useCallback((event: BaseEventOrig<InputProps.inputEventDetail>) => {
    let value = Number(inputVal)
    ChangeValue(value)
    props.onBlur && props.onBlur(event)
  }, [ChangeValue, props.onBlur, inputVal])

  // 点击事件
  const onTap = useCallback((type: "plus" | "minus") => {
    const isPlus = (type === "plus");
    if (isPlus) {
      if (disabled || disableMinus || currentValue < min) {
        props.onOverlimit && props.onOverlimit(type)
        return;
      }
    } else {
      if (disabled || disableMinus || currentValue > max) {
        props.onOverlimit && props.onOverlimit(type)
        return;
      }
    }
    const activeVal = isNaN(Number(inputVal)) ? currentValue : inputVal;
    const newValue = isPlus ? Big(activeVal).add(step).valueOf() : Big(activeVal).minus(step).valueOf();
    const NumVal = filter(newValue);
    ChangeValue(NumVal);

  }, [disabled, disablePlus, disableMinus, inputVal, min, max, props.onOverlimit, filter, ChangeValue]);

  // ====================================================
  // 长按节流事件
  const longPressTimer = useRef<NodeJS.Timeout>();
  const longPressStep = useCallback((type: "plus" | "minus") => {
    longPressTimer.current = setTimeout(() => {
      onTap(type);
      longPressStep(type)
    }, LONG_PRESS_START_TIME)
  }, [onTap])
  const onTouchStart = useCallback((type: "plus" | "minus") => {
    if (!longPress) {
      return;
    }
    if (longPressTimer.current != null) {
      clearTimeout(longPressTimer.current)
    }
    longPressTimer.current = setTimeout(() => {
      onTap(type);
      longPressStep(type)
    }, LONG_PRESS_START_TIME)
  }, [longPress, longPressStep, onTap])
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
    isH5 && props.className,
    isWeapp && 'custom-class'
  )}>
    {showMinus && <View
      style={css({
        width: size,
        height: size
      })}
      className={classnames(
        isH5 && props.minusClass,
        isWeapp && 'minus-class',
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
        isH5 && props.inputClass,
        isWeapp && 'input-class',
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
        isH5 && props.minusClass,
        isWeapp && 'plus-class',
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
(VanStepper as Taro.FunctionComponent<VanStepperProps<any>>).options = {
  addGlobalClass: true
};
(VanStepper as Taro.FunctionComponent<VanStepperProps<any>>).externalClasses = [
  'input-class', 'plus-class', 'minus-class', 'custom-class'
];
export default VanStepper;
