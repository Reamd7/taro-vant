import Taro from "@tarojs/taro";

import "./index.less";
import { useMemoBem, useMemoAddUnit, useMemoClassNames, isExternalClass, isNormalClass, noop, ActiveProps } from "../common/utils";
import { View } from "@tarojs/components";
import { VanCellProps } from "../Cell";
import VanFieldText from "../Field/VanFieldText";
import { VanFieldInputTextProps } from "../Field/common";
import useControllableValue, { ControllerValueProps } from "src/common/hooks/useControllableValue";
const DefaultProps = {
  leftIcon: "search",
  actionText: "取消",
  background: "#ffffff",
  maxLength: -1,
  shape: "square",
  clearable: true,
  onSearch: noop,
  onBlur: noop,
  onFocus: noop,
  onClear: noop,

  onCancel: noop,
}
type VanSearchClassNames = {
  'custom-class'?: string;
  className?: string;
  'field-class'?: string;
  fieldClass?: string;
  'input-class'?: string;
  inputClass?: string;
  'cancel-class'?: string;
  cancelClass?: string;
}

export type VanSearchProps = {
  label?: string;
  focus?: boolean;
  error?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  inputAlign?: VanFieldInputTextProps['inputAlign']
  showAction?: boolean;
  leftIcon?: VanCellProps['icon'];
  rightIcon?: VanCellProps['icon'];
  placeholder?: string;
  placeholderStyle?: string;
  actionText?: string;
  background?: string;
  maxLength?: number;
  shape?: string;
  clearable?: boolean;

  renderLabel?: React.ReactNode

  useLeftIconSlot?: boolean;
  renderLeftIcon?: React.ReactNode;

  useRightIconSlot?: boolean;
  renderRightIcon?: React.ReactNode;

  useActionSlot?: boolean;
  renderAction?: React.ReactNode;

  onSearch?: VanFieldInputTextProps['onConfirm'];
  onFocus?: VanFieldInputTextProps['onFocus'];
  onBlur?: VanFieldInputTextProps['onBlur'];
  onClear?: VanFieldInputTextProps['onClear'];
  onCancel?: VoidFunction;

} & VanSearchClassNames & ControllerValueProps<string, "defaultValue", "value", "onChange">
export type ActiveVanSearchProps = ActiveProps<VanSearchProps, keyof typeof DefaultProps>
const VanSearch: Taro.FunctionComponent<VanSearchProps> = (props: ActiveVanSearchProps) => {

  const bem = useMemoBem();
  const addUnit = useMemoAddUnit();
  const classname = useMemoClassNames();

  const [value, setValue] = useControllableValue(props, {
    defaultValue: "",
  })
  return <View
    className={
      classname(
        bem('search', { withaction: props.showAction || props.useActionSlot }),
        isNormalClass && props.className,
        isExternalClass && 'custom-class'
      )
    }
    style={{ background: props.background }}
  >
    <View className={bem('search__content', [props.shape])}>
      {props.label ?
        <View className="van-search__label">{props.label}</View> :
        props.renderLabel}
      <View className={
        classname(
          "van-search__field",
          isNormalClass && props.fieldClass,
          isExternalClass && 'field-class'
        )
      }>
        <VanFieldText
          type="text"
          leftIcon={!props.useLeftIconSlot ? props.leftIcon : ''}
          rightIcon={!props.useRightIconSlot ? props.rightIcon : ''}
          focus={props.focus}
          error={props.error}
          border={false}
          confirmType="search"

          value={value}
          onChange={setValue}

          disabled={props.disabled}
          readonly={props.readonly}
          clearable={props.clearable}
          maxLength={props.maxLength}
          inputAlign={props.inputAlign}
          inputClass="input-class"
          input-class="input-class"
          placeholder={props.placeholder}
          placeholderStyle={props.placeholderStyle}
          customStyle={{
            padding: `${addUnit(5)} ${addUnit(10)} ${addUnit(5)} 0`,
            backgroundColor: 'transparent'
          }}

          onConfirm={props.onSearch}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          onClear={props.onClear}

          renderLeftIcon={
            props.useLeftIconSlot ? props.renderLeftIcon : null
          }
          renderRightIcon={
            props.useRightIconSlot ? props.renderRightIcon : null
          }
        />
      </View>
      {(props.showAction || props.useActionSlot) &&
        <View
          className="van-search__action"
          hoverClass="van-search__action--hover"
          hoverStayTime={70}
        >
          {
            props.useActionSlot ? props.renderAction :
              <View onClick={() => {
                props.onCancel()
                setValue('')
              }} className="cancel-class">
                {props.actionText}
              </View>
          }
        </View>}
    </View>
  </View >
}
VanSearch.defaultProps = DefaultProps
VanSearch.options = {
  addGlobalClass: true
}
VanSearch.externalClasses = [
  'custom-class',
  'field-class',
  'input-class',
  'cancel-class'
]
export default VanSearch;
