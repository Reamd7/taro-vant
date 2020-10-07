import { useCallback } from '.pnpm/@tarojs/taro@2.2.15_nervjs@1.5.7/node_modules/@tarojs/taro';
import { View } from '@tarojs/components';
import Taro, { useMemo } from '@tarojs/taro';
import { FormField, useFormItem } from '../common/formitem';
import { addUnit, isH5, isWeapp, useMemoBem, useMemoClassNames } from '../common/utils';
import VanIcon from '../icon';

import "./index.less";
import { useCheckboxGroupItemContext } from './utils';

export type VanCheckBoxProps<Key extends string> = {
  shape?: "round" | "square";
  disabled?: boolean
  labelDisabled?: boolean
  labelPosition?: boolean
  useIconSlot?: boolean;
  checkedColor?: string;
  iconSize?: number;

  className?: string;
  ['custom-class']?: string;
  iconClass?: string;
  ['icon-class']?: string;
  labelClass?: string
  ['label-class']?: string;

  renderIcon?: React.ReactNode
  children?: React.ReactNode

  gid?: string; // group 的id
  // TODO ? 如何更好支持groupData，支持任意类型，而不是用 fieldName 作为值。

  onChange?: (val: boolean) => void;
} & FormField<Key, boolean>;

function iconStyle(checkedColor: VanCheckBoxProps<any>['checkedColor'], value: VanCheckBoxProps<any>['value'], disabled: VanCheckBoxProps<any>['disabled'], parentDisabled?: boolean, iconSize?: VanCheckBoxProps<any>['iconSize']) {

  const Style: React.CSSProperties = {
    fontSize: addUnit(iconSize)
  }
  if (checkedColor && value && !disabled && !parentDisabled) {
    Style.borderColor = checkedColor;
    Style.backgroundColor = checkedColor
  }

  return Style
}

const VanCheckBox = <Key extends string>(props: VanCheckBoxProps<Key>) => {
  const {
    shape = "round",
    defaultValue,
    disabled = false,
    labelDisabled = false,
    labelPosition = "right",
    useIconSlot = false,
    checkedColor = "#1989fa",
    iconSize = 20,
    value,
    fieldName,
    FormData
  } = props;
  if (props.gid) {
    if (fieldName === undefined) {
      throw new Error("使用checkboxGroup时缺少fieldName")
    } else if (value !== undefined) {
      throw new Error("使用checkboxGroup时不能为受控组件")
    } else if (FormData !== undefined) {
      throw new Error("使用checkboxGroup 不能指定FormData，因为被Group代理了")
    } else if (defaultValue !== undefined) {
      throw new Error("使用checkboxGroup 不能指定defaultValue，因为被Group代理了")
    }
  }



  const bem = useMemoBem();
  const classnames = useMemoClassNames();

  const Context = props.gid ? useCheckboxGroupItemContext(props.gid) : null;

  const parentDisabled = Context ? Context.groupdisabled : false;
  const parentChange = Context ? Context.onChange : null;

  const [currentValue, setCurrentValue] = useFormItem({
    fieldName,
    FormData,
    value: (Context && fieldName) ? Context.value.includes(fieldName) : value, // 把受控value值经过过滤传递到内部。
    defaultValue,
  });

  const iconWrapStyle = useMemo(() => iconStyle(checkedColor, currentValue, disabled, parentDisabled, iconSize), [
    checkedColor, currentValue, disabled, parentDisabled, iconSize
  ])
  // const scope = useScope();
  const toggle = useCallback((checked: boolean) => {
    if (parentChange) {
      if (!fieldName) return ; // 没有这个改啥改
      const needChange = parentChange(fieldName, checked);
      if (needChange) {
        // setCurrentValue(checked)
        props.onChange && Taro.nextTick(()=>{
          props.onChange && props.onChange(checked)
        })
      }
    } else {
      if (props.gid) {
        setCurrentValue(checked)
      }
      props.onChange && Taro.nextTick(()=>{
        props.onChange && props.onChange(checked)
      })
    }
  }, [fieldName, parentChange, setCurrentValue])

  return <View className={
    classnames(
      "van-checkbox",
      isWeapp && "custom-class",
      isH5 && props.className
    )
  }>
    <View className="van-checkbox__icon-wrap" onClick={() => {
      // toggle
      if (!disabled) {
        toggle(!currentValue)
      }
    }}>
      {useIconSlot ? props.renderIcon :
        <View
          className={bem('checkbox__icon', [shape, { disabled: disabled || parentDisabled, checked: currentValue }])}
          style={iconWrapStyle}
        >
          <VanIcon
            name="success"
            size="0.8em"
            className={
              classnames(
                isWeapp && "icon-class",
                isH5 && props.iconClass
              )
            }
            custom-class={
              classnames(
                isWeapp && "icon-class",
                isH5 && props.iconClass
              )
            }
            customStyle={{
              lineHeight: "1.25em"
            }}
          />
        </View>
      }
    </View>
    <View className={
      classnames(
        isWeapp && "label-class",
        isH5 && props.labelClass,
        bem('checkbox__label', [labelPosition, { disabled: disabled || parentDisabled }])
      )
    }
      onClick={() => {
        // onClickLabel
        if (!disabled && !labelDisabled) {
          toggle(!currentValue)
        }
      }}
    >{props.children}</View>
  </View>
}


VanCheckBox.options = {
  addGlobalClass: true
}

VanCheckBox.externalClasses = [
  'custom-class',
  'icon-class',
  'label-class'
]

export default VanCheckBox
