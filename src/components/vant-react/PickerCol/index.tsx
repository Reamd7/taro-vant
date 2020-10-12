import Taro, { useState, useMemo } from "@tarojs/taro";

import "./index.less";
import { View } from "@tarojs/components";
import { useMemoClassNames, isH5, isWeapp, useMemoAddUnit, range } from "../common/utils";
import { useCallback } from "react";

export type VanPickerColProps<Key extends string> = {
  ['custom-class']?: string
  className?: string;
  activeClass?: string;
  ['active-class']?: string;

  valueKey?: Key;
  itemHeight: number;
  visibleItemCount: number;
  initialOptions?: Array<({
    disabled?: boolean;
  } & Record<Key, string>) | string>;
  defaultIndex?: number;

  onChange: (index: number) => void;
}
const DEFAULT_DURATION = 200;

type ArrayValue<E extends Array<unknown>> = E extends Array<infer R> ? R : never

const VanPickerCol = <Key extends string>(props: VanPickerColProps<Key>) => {
  const {
    visibleItemCount,
    itemHeight,
    valueKey
  } = props;
  const classnames = useMemoClassNames();
  const addUnit = useMemoAddUnit();

  const options = useMemo(() => props.initialOptions || [], [props.initialOptions])
  // const [options, setOptions] = useState(props.initialOptions || []);
  const [currentIndex, setcurrentIndex] = useState(props.defaultIndex || 0);
  const [startY, setstartY] = useState(0);
  const [offset, setoffset] = useState(0);
  const [duration, setduration] = useState(0);
  const [startOffset, setstartOffset] = useState(0);


  const getOptionText = useCallback((option: ArrayValue<NonNullable<typeof props['initialOptions']>>) => {
    return typeof option === "string" ? option : valueKey ? option[valueKey] : ''
  }, [valueKey])

  const getCount = useMemo(() => {
    return options.length
  }, [options]);
  const isDisabled = useCallback((option: ArrayValue<NonNullable<typeof props['initialOptions']>>) => {
    return typeof option === 'object' && option.disabled
  }, [])
  const adjustIndex = useCallback((index: number) => {
    index = range(index, 0, getCount);

    for (let i = index; i < getCount; i++) {
      if (!isDisabled(options[i])) return i;
    }
    for (let i = index - 1; i >= 0; i--) {
      if (!isDisabled(options[i])) return i;
    }
  }, [options, getCount, isDisabled])

  const setIndex = useCallback((index: number, userAction: boolean) => {
    index = adjustIndex(index) || 0;
    const offset = -index * itemHeight;
    if (index !== currentIndex) {
      setoffset(offset)
      setcurrentIndex(index);
      Taro.nextTick(() => {
        userAction && props.onChange(index)
      })
    }
  }, [adjustIndex, itemHeight, currentIndex, props.onChange])

  return <View
    className={
      classnames(
        "van-picker-column",
        isH5 && props.className,
        isWeapp && 'custom-class'
      )
    }
    style={{
      height: addUnit(itemHeight * visibleItemCount)
    }}
    onTouchStart={(e) => {
      setstartY(e.touches[0].clientY)
      setstartOffset(offset)
      setduration(0)
    }}
    onTouchMove={(event) => {
      event.stopPropagation();
      const deltaY = event.touches[0].clientY - startY;
      setoffset(
        range(
          startOffset + deltaY,
          -(getCount * itemHeight),
          itemHeight
        )
      )
    }}
    onTouchEnd={() => {
      if (offset !== startOffset) {
        setduration(DEFAULT_DURATION)
        const index = range(
          Math.round(-offset / itemHeight),
          0,
          getCount - 1
        );
        setIndex(index, true)
      }
    }}
    onTouchCancel={() => {
      if (offset !== startOffset) {
        setduration(DEFAULT_DURATION)
        const index = range(
          Math.round(-offset / itemHeight),
          0,
          getCount - 1
        );
        setIndex(index, true)
      }
    }}
  >
    <View style={{
      transition: duration + "ms",
      lineHeight: addUnit(itemHeight),
      transform: `translate3d(0, ${offset + (itemHeight * (visibleItemCount - 1)) / 2}px, 0)`
    }}>
      {options.map((option, index) => {
        return <View
          key={index}
          style={{
            height: addUnit(itemHeight)
          }}
          className={
            classnames(
              "van-ellipsis van-picker-column__item",
              (typeof option !== "string" && option.disabled) && 'van-picker-column__item--disabled',
              index === currentIndex && 'van-picker-column__item--selected active-class'
            )
          }
          onClick={() => {
            setIndex(index, true)
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
