import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
const { useMemo } = Taro /** api **/;
import { addUnit, bem, useMemoClassNames, ActiveProps, useRelationPropsListener, ExtClass } from '../utils';
import VanIcon from '../icon';

import "./index.less";
import useControllableValue, { ControllerValueProps } from '../hooks/useControllableValue'

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

  index?: number;
  total?: number;
} & ControllerValueProps<boolean, "checked">

function iconStyle(checkedColor: VanCheckBoxProps['checkedColor'], checked: boolean, disabled: VanCheckBoxProps['disabled'], iconSize?: VanCheckBoxProps['iconSize']) {

  const Style: React.CSSProperties = {
    fontSize: addUnit(iconSize)
  }
  if (checkedColor && checked && !disabled) {
    Style.borderColor = checkedColor;
    Style.backgroundColor = checkedColor
  } else {
    Style.borderColor = "";
    Style.backgroundColor = "";
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


type ActiveVanCheckBoxProps = ActiveProps<VanCheckBoxProps, keyof typeof DefaultProps>


const VanCheckBox: Taro.FunctionComponent<VanCheckBoxProps> = (__props__: ActiveVanCheckBoxProps) => {
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
    gid = ''
  } = __props__;
  const isNotUsingGroup = useMemo(() => !(gid && name), [gid, name]);

  const {
    value,
    checked,
    onChange
  } = useRelationPropsListener(gid, __props__);

  const classnames = useMemoClassNames();

  // 内部 innerValue
  const [currentValue, setCurrentValue] = useControllableValue({
    value: isNotUsingGroup ? __props__.value : value,
    defaultValue: isNotUsingGroup ? __props__.checked : checked,
    onChange: isNotUsingGroup ? __props__.onChange : onChange
  }, {
    defaultValue: false,
  });

  const iconWrapStyle = useMemo(() => iconStyle(checkedColor, currentValue, disabled, iconSize), [
    checkedColor, currentValue, disabled, iconSize
  ])

  if (gid) {
    if (name === undefined) {
      throw new Error("使用checkboxGroup时缺少fieldName")
    }
  }
  return <View className={
    classnames(
      "van-checkbox",
      inline && 'van-checkbox__inline',
      ExtClass(__props__, "className"),
    )
  }>
    <View className="van-checkbox__icon-wrap" onClick={() => {
      // toggle
      if (!disabled) {
        setCurrentValue(currentValue => !currentValue)
      }
    }}>
      {useIconSlot ? __props__.renderIcon :
        <View
          className={bem('checkbox__icon', [shape, { disabled, checked: currentValue }])}
          style={iconWrapStyle}
        >
          <VanIcon
            name="success"
            size="0.8em"
            className={__props__.iconClass}
            custom-class={__props__["icon-class"]}
            customStyle={{
              lineHeight: "1.25em"
            }}
          />
        </View>
      }
    </View>
    <View className={
      classnames(
        ExtClass(__props__, "labelClass"),
        bem('checkbox__label', [labelPosition, { disabled }])
      )
    }
      onClick={() => {
        // onClickLabel
        if (!disabled && !labelDisabled) {
          setCurrentValue(currentValue => !currentValue)
        }
      }}
    >{__props__.children}</View>
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

VanCheckBox.defaultProps = DefaultProps;

export default VanCheckBox
