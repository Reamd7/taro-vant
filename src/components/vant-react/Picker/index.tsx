import Taro from "@tarojs/taro";

import "./index.less";
import { View, Block } from "@tarojs/components";
import { useMemoClassNames, isH5, isWeapp, useMemoAddUnit } from "../common/utils";
import VanLoading from "../loading";
import VanPickerCol, { VanPickerColProps } from "../PickerCol";

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

  valueKey?: Key;
  toolbarPosition?: string;
  defaultIndex?: number;
  columns?: Array<{
    key: string;
    values: VanPickerColProps<Key>['initialOptions'];
    defaultIndex?: number;
  }>
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
    columns = []
  } = props;

  const classnames = useMemoClassNames();
  const addUnit = useMemoAddUnit();

  const toolbar = () => {
    return props.showToolbar && <View className={
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
        data-type="cancel"
        bindtap="emit"
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
        data-type="confirm"
        bindtap="emit"
      >
        {confirmButtonText}
      </View>
    </View>
  }

  return <View className={
    classnames(
      "van-picker",
      isH5 && props.className,
      isWeapp && "custom-class"
    )
  }>
    {toolbarPosition === 'top' && <Block>
      {toolbar()}
    </Block>}
    {loading && <View className="van-picker__loading">
      <VanLoading color="#1989fa" />
    </View>}
    <View
      className="van-picker__columns"
      style={{
        height: addUnit(itemHeight * visibleItemCount)
      }}
      onTouchMove={e => e.stopPropagation()}
    >
      {columns.map(item => {
        return <View className="van-picker__column">
          <VanPickerCol
            key={item.key}
            className={props.columnClass}
            custom-class="column-class"
            valueKey={valueKey}
            itemHeight={itemHeight}
            initialOptions={item.values}
            defaultIndex={item.defaultIndex || defaultIndex}
            visibleItemCount={visibleItemCount}
            activeClass={classnames(
              isH5 && props.activeClass,
              isWeapp && 'active-class'
            )}
            onChange="onChange"
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
      {toolbar()}
    </Block>}
  </View>
}

VanPicker.options = {
  addGlobalClass: true
}

export default VanPicker;
