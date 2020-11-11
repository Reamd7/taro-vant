import Taro, { useState, useRef, useMemo } from "@tarojs/taro";

import "./index.less";
import { View, Block } from "@tarojs/components";
import { useMemoClassNames, isH5, isWeapp, useMemoAddUnit } from "../common/utils";
import VanLoading from "../Loading";
import VanPickerCol, { VanPickerColProps } from "../PickerCol";
import useUpdateEffect from "src/common/hooks/useUpdateEffect";
import usePersistFn from "src/common/hooks/usePersistFn";

export type VanPickerProps<Key extends string> = {
  ['custom-class']?: string;
  className?: string;
  ['active-class']?: string;
  activeClass?: string;
  ['toolbar-class']?: string;
  toolbarClass?: string;
  ['column-class']?: string;
  columnClass?: string;

  title?: string;
  loading?: boolean;
  showToolbar?: boolean;
  cancelButtonText?: string;
  confirmButtonText?: string;
  visibleItemCount?: number;
  itemHeight?: number;
  toolbarPosition?: string;

  valueKey: Key;
  defaultIndex?: number;
  columns: Array<{
    key: string;
    values: NonNullable<VanPickerColProps<Key>['initialOptions']>;
    defaultIndex?: number;
  }>
  textFormatter?: (key: string, value: string) => string;
  value?: number[];
  onConfirm?: (val: number[]) => void;
  onChange?: ((val: number[]) => void | false);
  onCancel?: (val: number[]) => void;
}


const VanPicker = <Key extends string>(props: VanPickerProps<Key>) => {
  const {
    cancelButtonText = "取消",
    confirmButtonText = "确认",
    visibleItemCount = 6,
    itemHeight = 44,
    valueKey,
    toolbarPosition = "top",
    defaultIndex = 0,
    columns = [],
    showToolbar = false
  } = props;

  const classnames = useMemoClassNames();
  const addUnit = useMemoAddUnit();

  const value = props.value;

  const initialValue = useMemo(() => {
    if ('value' in props) {
      return value || [] // 受控组件
    }
    return columns.map(item => {
      return item.defaultIndex || defaultIndex
    })
  }, []);

  const [valueList, _setValueList] = useState(initialValue);

  const setValueList = usePersistFn(
    (v: number[]) => {
      if (!('value' in props)) {
        _setValueList(v);
      }
      if (props.onChange) {
        return props.onChange(v);
      }
    },
    [props.onChange, props.value],
  );
  /* init 的时候不用执行了 */
  useUpdateEffect(() => {
    if (value) {
      _setValueList(value);
    }
  }, [value]);

  const confirmVal = useRef<number[]>(initialValue);

  const onConfirm = usePersistFn(() => {
    confirmVal.current = valueList.slice()
    props.onConfirm && props.onConfirm(confirmVal.current)
  }, [valueList, props.onConfirm])

  const onCancel = usePersistFn(() => {
    _setValueList(confirmVal.current);
    props.onCancel && props.onCancel(confirmVal.current)
  }, [props.onCancel])

  const renderToolbar = showToolbar && <View className={
    classnames(
      "van-picker__toolbar",
      isH5 && props.toolbarClass,
      isWeapp && "toolbar-class"
    )
  }>
    <View
      className="van-picker__cancel"
      hoverClass="van-picker__cancel--hover"
      hoverStayTime={70}
      onClick={onCancel}
    >
      {cancelButtonText}
    </View>
    {props.title && <View className="van-picker__title van-ellipsis">
      {props.title}
    </View>}
    <View
      className="van-picker__confirm"
      hoverClass="van-picker__confirm--hover"
      hoverStayTime={70}
      onClick={onConfirm}
    >
      {confirmButtonText}
    </View>
  </View>


  return <View className={
    classnames(
      "van-picker",
      isH5 && props.className,
      isWeapp && "custom-class"
    )
  }>
    {toolbarPosition === 'top' && <Block>
      {renderToolbar}
    </Block>}
    {props.loading && <View className="van-picker__loading">
      <VanLoading color="#1989fa" />
    </View>}
    <View
      className="van-picker__columns"
      style={{
        height: addUnit(itemHeight * visibleItemCount)
      }}
      onTouchMove={e => e.stopPropagation()}
    >
      {columns.map((item, index) => {
        return <View className="van-picker__column">
          <VanPickerCol
            key={item.key}
            className={props.columnClass}
            custom-class="column-class"
            valueKey={valueKey}
            itemHeight={itemHeight}
            initialOptions={item.values}
            defaultValue={item.defaultIndex || defaultIndex}
            value={valueList[index]}
            visibleItemCount={visibleItemCount}
            activeClass={classnames(
              isH5 && props.activeClass,
              isWeapp && 'active-class'
            )}
            onChange={(itemIndex) => {
              if (valueList[index] !== itemIndex) {
                const newList = valueList.slice();
                newList[index] = itemIndex;
                return setValueList(newList)
              }
              return false
            }}
            textFormatter={
              props.textFormatter ? (val: string) => {
                return props.textFormatter ? props.textFormatter(item.key, val) : val
              } : undefined
            }
          />
        </View>
      })}
      <View className="van-picker__mask" style={{
        backgroundSize: `100% ${addUnit((itemHeight * visibleItemCount - itemHeight) / 2)}`
      }} />
      <View
        className="van-picker__frame van-hairline--top-bottom"
        style={{
          height: addUnit(itemHeight)
        }}
      />
    </View>
    {toolbarPosition === 'bottom' && <Block>
      {renderToolbar}
    </Block>}
  </View>
}

VanPicker.options = {
  addGlobalClass: true,

}
VanPicker.externalClasses = [
  'custom-class',
  'active-class',
  'toolbar-class',
  'column-class'
]
VanPicker.defaultProps = {
  cancelButtonText: "取消",
  confirmButtonText: "确认",
  visibleItemCount: 6,
  itemHeight: 44,
  toolbarPosition: "top",
  defaultIndex: 0,
  columns: [],
  showToolbar: false
}
export default VanPicker;
