import Taro from "@tarojs/taro";
const { useState, useRef, useMemo, useCallback } = Taro /** api **/;
import "./index.less";
import "../PickerCol/index.less";
import { View, Block, PickerView, PickerViewColumn } from "@tarojs/components";
import { useMemoClassNames, isExternalClass, isNormalClass, useMemoAddUnit, ActiveProps, noop, pxUnit, isH5 } from "../common/utils";
import VanLoading from "../Loading";
// import VanPickerCol, { VanPickerColProps } from "../PickerCol";
import useUpdateEffect from "src/common/hooks/useUpdateEffect";
import usePersistFn from "src/common/hooks/usePersistFn";
import { VanPickerColProps } from "../PickerCol";

const arrayDiff = (arr: number[], arr2: number[]) => {
  if (arr.length !== arr2.length) return false;
  return arr.reduce((res, val, index) => {
    if (res) {
      return val === arr2[index]
    }
    return false;
  }, true)
}

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
  value?: number[];
  columns: Array<{
    key: string;
    values: NonNullable<VanPickerColProps<Key>['initialOptions']>;
    defaultIndex?: number;
  }>
  textFormatter?: (key: string, value: string) => string;
  onConfirm?: (val: number[]) => void;
  onChange?: ((val: number[]) => void | false);
  onCancel?: (val: number[]) => void;
}
const DefaultProps = {
  cancelButtonText: "取消",
  confirmButtonText: "确认",
  visibleItemCount: 6,
  itemHeight: 44,
  toolbarPosition: "top",
  defaultIndex: 0,
  columns: [],
  showToolbar: false,
  onChange: noop
}

export type ActiveVanPickerProps<Key extends string> = ActiveProps<VanPickerProps<Key>, keyof typeof DefaultProps>
type ArrayValue<E extends Array<unknown>> = E extends Array<infer R> ? R : never

// 这里默认value 和 defaultIndex 都不包含 disabled
//
const VanPicker = <Key extends string>(_props: VanPickerProps<Key>) => {
  const props = _props as ActiveVanPickerProps<Key>
  const {
    cancelButtonText,
    confirmButtonText,
    visibleItemCount,
    itemHeight,
    valueKey,
    toolbarPosition,
    defaultIndex,
    columns,
    showToolbar,

    value,
    onChange
  } = props;

  const handleValue = useCallback((v2: number[]) =>
    v2.map((v, i, arr) => {
      const val = columns[i].values[v];
      const length = arr.length;
      if (val) {
        if (typeof val !== "string" && val.disabled) {
          if (v === 0) {
            return 1
          } else if (v === (length - 1)) {
            return length - 2 // BUG 这里可能有bug，假如这个list只有一个disabled，是有问题的。
          } else {
            return v + 1
          }
        } else {
          return v
        }
      } else {
        // undefined 找到最后一个 非 disabled
        return columns[i].values.reduceRight<number>(function(res, value, index) {
          if (res === undefined) {
            if (typeof value === "string") {
              return index
            } else if (value.disabled){
              return undefined as any
            } else {
              return index
            }
          } else {
            return res;
          }
        }, undefined as any)
      }
    }), [columns]);

  const classnames = useMemoClassNames();
  const addUnit = useMemoAddUnit();

  const ControlledComponent = 'value' in props

  const initialValue = useMemo(() => {
    if (ControlledComponent) {
      return value || [] // 受控组件
    }
    return columns.map(item => {
      return item.defaultIndex || defaultIndex
    })
  }, []);

  const [valueList, _setValueList] = useState(() => {
    return handleValue(initialValue)
  });
  const setValueList = usePersistFn(
    (v: number[]) => {
      const newValue = handleValue(v);
      const reval = arrayDiff(newValue, valueList)

      if (reval) {
        _setValueList(v);
        setTimeout(() => {
          if (!ControlledComponent) { // 非受控组件直接进行修改。
            _setValueList(newValue);
          }
          onChange(newValue); // 受控组件调用onChange进行修改
        }, 0)
      } else {
        if (!ControlledComponent) { // 非受控组件直接进行修改。
          _setValueList(newValue);
        }
        onChange(newValue); // 受控组件调用onChange进行修改
      }
    },
    [onChange, valueList, handleValue],
  );
  /* init 的时候不用执行了 */
  useUpdateEffect(() => {
    // console.log("onValueChange")
    if (value) {
      const newValue = handleValue(value);
      const reval = arrayDiff(newValue, valueList)
      if (reval) {
        _setValueList(value);
        setTimeout(()=>{
          _setValueList(newValue);
        }, 0)
      } else {
        _setValueList(newValue);
      }
    }
  }, [value, handleValue]);

  useUpdateEffect(()=>{
    // columns改变了，
    // 抹平wechat和alipay的差异，
    if (process.env.TARO_ENV === "alipay") {
      if (value) {
        const newValue = handleValue(value);
        if (!arrayDiff(newValue, value)) {
          setValueList(
            newValue
          )
        }
      }
    }
  }, [columns])

  const confirmVal = useRef<number[]>(initialValue);
  const onConfirm = usePersistFn(() => {
    confirmVal.current = valueList.slice()
    props.onConfirm && props.onConfirm(confirmVal.current)
  }, [valueList, props.onConfirm])
  const onCancel = usePersistFn(() => {
    _setValueList(confirmVal.current);
    props.onCancel && props.onCancel(confirmVal.current)
  }, [props.onCancel])

  const getOptionText = useCallback((key: string, option: string | ({
    disabled?: boolean | undefined;
  } & Record<Key, string>)) => {
    const val = typeof option === 'object' ? (valueKey ? option[valueKey!] : '') : option;
    return props.textFormatter ? props.textFormatter(key, val) : val;
  }, [valueKey, props.textFormatter]);

  const renderToolbar = showToolbar && <View className={
    classnames(
      "van-picker__toolbar",
      "toolbar-class",
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
      isNormalClass && props.className,
      isExternalClass && "custom-class"
    )
  }
    onTouchStart={e => {
      e.stopPropagation()
    }}
    onTouchMove={e => {
      e.stopPropagation()
    }}
    onTouchEnd={e => {
      e.stopPropagation()
    }}
  >
    {toolbarPosition === 'top' && <Block>
      {renderToolbar}
    </Block>}
    {props.loading && <View className="van-picker__loading">
      <VanLoading color="#1989fa" />
    </View>}
    <PickerView
      value={valueList}
      style={{
        height: addUnit(itemHeight * visibleItemCount)
      }}
      onChange={(e) => {
        // console.log("onChange")
        const newValue = e.detail.value;
        setValueList(
          newValue
        )
      }}
      maskClass="van-picker__mask"
      maskStyle={`background-size: ${`100% ${addUnit((itemHeight * visibleItemCount - itemHeight) / 2)}`}`}
      indicatorStyle={`height: ${pxUnit(itemHeight)};`}
    >
      {/* {{
        backgroundSize: `100% ${addUnit((itemHeight * visibleItemCount - itemHeight) / 2)}`
      }} */}
      {columns.map((item, cindex) => {
        return <PickerViewColumn key={item.key}>
          {(item.values).map((option, index) => {
            return <View
              key={typeof option === 'object' ? option[valueKey!] : option}
              className={
                classnames(
                  "van-ellipsis van-picker-column__item",
                  ((typeof option === 'object') && option.disabled) && 'van-picker-column__item--disabled',
                  index === valueList[cindex] && `van-picker-column__item--selected ${
                    classnames(
                      isNormalClass && props.activeClass,
                      isExternalClass && 'active-class'
                    )
                  }`,
                )
              }
            >{getOptionText(item.key, option)}</View>
          })}
        </PickerViewColumn>
      })}
    </PickerView>
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
