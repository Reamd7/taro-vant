import { View } from '@tarojs/components';
import Taro, { useMemo, useCallback, useEffect } from '@tarojs/taro';
import { addUnit, isH5, isWeapp, useMemoBem, useMemoClassNames, noop } from '../common/utils';
import VanIcon from '../icon';

import "./index.less";
import { useCheckboxGroupItemContext } from './utils';
import useControllableValue, { ControllerValueProps } from 'src/common/hooks/useControllableValue';
import useUpdateEffect from 'src/common/hooks/useUpdateEffect';

export type VanCheckBoxProps = {
  shape?: "round" | "square";
  disabled?: boolean
  labelDisabled?: boolean
  labelPosition?: "right" | "left"
  useIconSlot?: boolean;
  checkedColor?: string;
  iconSize?: number;

  inline?: boolean;

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

  name?: string;
} & ControllerValueProps<boolean, "checked">

function iconStyle(checkedColor: VanCheckBoxProps['checkedColor'], checked: boolean, disabled: VanCheckBoxProps['disabled'], parentDisabled?: boolean, iconSize?: VanCheckBoxProps['iconSize']) {

  const Style: React.CSSProperties = {
    fontSize: addUnit(iconSize)
  }
  if (checkedColor && checked && !disabled && !parentDisabled) {
    Style.borderColor = checkedColor;
    Style.backgroundColor = checkedColor
  }

  return Style
}

const DefaultProps = {
  shape: "round",
  disabled: false,
  labelDisabled: false,
  labelPosition: "right",
  useIconSlot: false,
  checkedColor: "#1989fa",
  iconSize: 20,
} as const

type KeyDefaultProps = keyof typeof DefaultProps;
type ActiveVanCheckBoxProps = Omit<VanCheckBoxProps, KeyDefaultProps> & Required<Pick<VanCheckBoxProps, KeyDefaultProps>>;


const VanCheckBox: Taro.FunctionComponent<VanCheckBoxProps> = (props: ActiveVanCheckBoxProps) => {
  const {
    // shape = "round",
    // disabled = false,
    // labelDisabled = false,
    // labelPosition = "right",
    // useIconSlot = false,
    // checkedColor = "#1989fa",
    // iconSize = 20,
    shape,
    disabled,
    labelDisabled,
    labelPosition,
    useIconSlot,
    checkedColor,
    iconSize,

    inline,
    name,
    gid,
    checked: defaultValue
  } = props;

  const bem = useMemoBem();
  const classnames = useMemoClassNames();

  const Context = useCheckboxGroupItemContext(gid);
  const parentDisabled = Context ? Context.groupdisabled : false;
  const parentChange = Context ? Context.onChange : noop;

  const isUsingGroup = useMemo(() => !!(gid && name), [gid, name]);
  // 元素是否被禁用
  const elementDisabled = useMemo(() => {
    return (isUsingGroup) ? (parentDisabled || disabled) : disabled
  }, [isUsingGroup, parentDisabled, disabled]);

  const elementChecked = (Context && name) ? Context.value.includes(name) : undefined;

  // 内部 innerValue
  const [currentValue, setCurrentValue] = useControllableValue({
    ...props,
    checked: (Context && name) ? elementChecked : props.checked,
  }, {
    defaultValue: (Context && name) ? !!elementChecked : false,
    defaultValuePropName: "checked"
  });

  const iconWrapStyle = useMemo(() => iconStyle(checkedColor, currentValue, disabled, parentDisabled, iconSize), [
    checkedColor, currentValue, disabled, parentDisabled, iconSize
  ])

  // 联动更新
  useUpdateEffect(() => {
    if (elementChecked !== undefined) {
      setCurrentValue(elementChecked)
    }
  }, [elementChecked, setCurrentValue])


  // const scope = useScope();
  const toggle = useCallback((checked: boolean) => {
    if (elementDisabled) return; // 禁用就禁止触发。

    if (isUsingGroup && name) {
      // 使用Group
      parentChange(name, checked); // parentChange => parentValue => currentValue
    } else {
      // 不使用Group
      setCurrentValue(checked)
    }
    // if (parentChange) {
    //   if (!name) return; // 没有这个改啥改
    //   const needChange = parentChange(name, checked);
    //   if (needChange) {
    //     // setCurrentValue(checked)
    //     props.onChange && Taro.nextTick(() => {
    //       props.onChange && props.onChange(checked)
    //     })
    //   }
    // } else {
    //   if (props.gid) {
    //     setCurrentValue(checked)
    //   }
    //   props.onChange && Taro.nextTick(() => {
    //     props.onChange && props.onChange(checked)
    //   })
    // }
  }, [elementDisabled, isUsingGroup, name, parentChange, setCurrentValue])

  if (gid) {
    if (name === undefined) {
      throw new Error("使用checkboxGroup时缺少fieldName")
    } else if (props.value !== undefined) {
      throw new Error("使用checkboxGroup时不能为受控组件")
    } else if (defaultValue !== undefined) {
      throw new Error("使用checkboxGroup 不能指定 defaultValue，因为被Group代理了")
    }
  }
  return <View className={
    classnames(
      "van-checkbox",
      inline && 'van-checkbox__inline',
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

VanCheckBox.defaultProps = DefaultProps

export default VanCheckBox
