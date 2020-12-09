import Taro from "@tarojs/taro";
import { useState, useMemo, useCallback } from '@tarojs/taro' /** api **/;
import "./index.less";
import { View } from "@tarojs/components";
import { useMemoClassNames, isExternalClass, isNormalClass, useMemoAddUnit, range } from "../common/utils";
import usePersistFn from "src/common/hooks/usePersistFn";
import useUpdateEffect from "src/common/hooks/useUpdateEffect";

export type VanPickerColProps<Key extends string> = {
  ['custom-class']?: string
  className?: string;
  activeClass?: string;
  ['active-class']?: string;

  itemHeight: number;
  visibleItemCount: number;
  // =================================
  valueKey?: Key;
  initialOptions?: Array<({
    disabled?: boolean;
  } & Record<Key, string>) | string>;
  // =================================
  defaultValue?: number;
  value?: number;
  onChange: ((index: number) => void | false);

  textFormatter?: (value: string) => string;
}
const DEFAULT_DURATION = 100;

const isDisabled = (option: ({
  disabled?: boolean;
} & Record<any, string>) | string) => {
  return typeof option === 'object' && option.disabled
}

type ArrayValue<E extends Array<unknown>> = E extends Array<infer R> ? R : never
// TODO 如果修改为完全受控组件能不能省一点性能？，因为外部引用的组件也是直接调用内部方法。
const VanPickerCol = <Key extends string>(props: VanPickerColProps<Key>) => {
  const {
    visibleItemCount,
    itemHeight,
    valueKey,
    defaultValue = 0
  } = props;
  const classnames = useMemoClassNames();
  const addUnit = useMemoAddUnit();

  const options = useMemo(() => props.initialOptions || [], [props.initialOptions]);
  const getCount = useMemo(() => options.length, [options]);
  const adjustIndex = useCallback((index: number) => {
    index = range(index, 0, getCount);
    for (let i = index; i < getCount; i++) {
      if (!isDisabled(options[i])) return i;
    }
    for (let i = index - 1; i >= 0; i--) {
      if (!isDisabled(options[i])) return i;
    }
  }, [options, getCount, isDisabled])

  const value = props.value;
  const initialValue = useMemo(() => {
    if ('value' in props && value !== undefined) {
      return value // 受控组件
    }
    if ('defaultValue' in props && props.defaultValue !== undefined) {
      return props.defaultValue // 默认值
    }
    return defaultValue // options 的 默认值
  }, []);
  const [currentIndex, _setcurrentIndex] = useState(initialValue);
  useUpdateEffect(() => {
    if ('value' in props && value !== undefined) {
      _setcurrentIndex(value);
    }
  }, [value]);


  const [offset, setOffset] = useState(-currentIndex * itemHeight);
  useUpdateEffect(()=>{
    setOffset(-currentIndex * itemHeight);
  }, [currentIndex, itemHeight]) // 联动更新

  const setcurrentIndex = usePersistFn(
    (v: number) => {
      if (!('value' in props)) {
        _setcurrentIndex(v);
      }
      const index = currentIndex;
      const res = props.onChange(v);
      if (res === false && ('value' in props)) {
        setOffset(-index * itemHeight)
        _setcurrentIndex(index)
      }
    },
    [props.value, props.onChange, currentIndex, itemHeight],
  );

  const [startY, setStartY] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startOffset, setStartOffset] = useState(0);

  const getOptionText = useCallback((option: ArrayValue<NonNullable<typeof props['initialOptions']>>) => {
    const val = typeof option === 'object' ? valueKey ? option[valueKey] : '' : option;
    return props.textFormatter ? props.textFormatter(val) : val;
  }, [valueKey, props.textFormatter]);
  const setIndex = useCallback((index: number) => {
    index = adjustIndex(index) || 0;
    const offset = -index * itemHeight;
    if (index !== currentIndex) {
      setcurrentIndex(index); // => 在联动更新处更新 | onChange => change val => change currentIndex => 在联动更新处更新
    } else {
      setOffset(offset)
    }
  }, [adjustIndex, itemHeight, currentIndex, setcurrentIndex])

  const updateWhenOptionsChange = usePersistFn(()=>{
    if (options.length && currentIndex >= options.length) {
      setIndex(options.length - 1)
    }
  }, [options, currentIndex])
  useUpdateEffect(()=>{
    updateWhenOptionsChange()
  }, [options])

  const onTouchStart = usePersistFn((event:
    Parameters<
      NonNullable<React.ComponentProps<typeof View>['onTouchStart']>
    >[0]
  ) => {
    setStartY(event.touches[0].clientY)
    setStartOffset(offset);
    setDuration(0)
  }, [offset]);
  const onTouchMove = usePersistFn((event:
    Parameters<
      NonNullable<React.ComponentProps<typeof View>['onTouchMove']>
    >[0]
  ) => {
    const deltaY = event.touches[0].clientY - startY;
    setOffset(
      range(
        startOffset + deltaY,
        -(getCount * itemHeight),
        itemHeight
      )
    )
  }, [startY, startOffset, getCount, itemHeight]);
  const onTouchEnd = usePersistFn(() => {
    if (offset !== startOffset) {
      setDuration(DEFAULT_DURATION);
      setIndex(
        range(
          Math.round(-offset / itemHeight),
          0,
          getCount - 1
        )
      )
    }
  }, [offset, startOffset, itemHeight, getCount, setIndex]);


  return <View
    className={
      classnames(
        "van-picker-column",
        isNormalClass && props.className,
        isExternalClass && 'custom-class'
      )
    }
    style={{
      height: addUnit(itemHeight * visibleItemCount)
    }}
    onTouchStart={onTouchStart}
    onTouchMove={(event) => {
      event.stopPropagation();
      onTouchMove(event);
    }}
    onTouchEnd={onTouchEnd}
    onTouchCancel={onTouchEnd}
  >
    <View style={{
      transition: duration + "ms",
      lineHeight: addUnit(itemHeight),
      transform: `translate3d(0, ${offset + (itemHeight * (visibleItemCount - 1)) / 2}px, 0)`
    }}>
      {(options).map((option, index) => {
        return <View
          key={typeof option === 'object' ? option[valueKey!]: option}
          style={{
            height: addUnit(itemHeight)
          }}
          className={
            classnames(
              "van-ellipsis van-picker-column__item",
              ((typeof option === 'object') && option.disabled) && 'van-picker-column__item--disabled',
              index === currentIndex && 'van-picker-column__item--selected active-class'
            )
          }
          onClick={() => {
            setIndex(index)
          }}
        >{getOptionText(option)}</View>
      })}
    </View>
  </View >
}

VanPickerCol.options = {
  addGlobalClass: true
}

export default VanPickerCol;
