import Taro from "@tarojs/taro";
const { useState, useEffect, useMemo } = Taro /** api **/;
import "./index.less";
import VanCell from "../Cell";
import { useMemoClassNames, bem, isExternalClass, isNormalClass } from "../utils"
import { View, Input } from "@tarojs/components";
import useControllableValue from "../hooks/useControllableValue"
import { VanFieldDefaultProps, VanFieldInputNumberProps, ActiveVanFieldInputNumberProps, VanCellContainerTitleStyle, externalClasses } from "./common";
import VanIcon from "../icon";

function Val2displayValue(value: number) {
  if (isNaN(value)) {
    return (''); // value -> displayValue
  } else {
    return (String(value)); // value -> displayValue
  }
}

const VanFieldNumber: Taro.FunctionComponent<
  VanFieldInputNumberProps
> = (props: ActiveVanFieldInputNumberProps) => {

  const classnames = useMemoClassNames();


  const [value, setValue] = useControllableValue(props, {
    defaultValue: 0,
  })
  const [focused, setFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>(""); // 显示值;
  useEffect(() => {
    setDisplayValue(
      Val2displayValue(value) // value -> displayValue
    )
  }, [value])

  const showClear = useMemo(() => !!props.clearable && !!focused && !!value && !props.readonly, [props.clearable, props.readonly, focused, value]);
  const {
    label,
    errorMessage
  } = props
  return <VanCell
    size={props.size}
    icon={props.leftIcon}
    center={props.center}
    border={props.border}
    isLink={props.isLink}
    required={props.required}
    clickable={props.clickable}
    titleWidth={props.titleWidth}
    titleStyle={VanCellContainerTitleStyle}
    customStyle={props.customStyle}
    arrowDirection={props.arrowDirection}
    custom-class="van-field"
    className="van-field"
    title-class={"label-class"}
    titleClass={props.labelClass}
    renderIcon={props.renderLeftIcon}
    useTitleSlot={!!label || props.useLabelSlot}
    renderTitle={
      label ? <View className={
        bem('field__label', { disabled: props.disabled })
      }>
        {label}
      </View> : props.renderLabel
    }
  >
    <View className={
      bem('field__body', [props.type])
    }>
      <Input
        className={classnames(
          isNormalClass && props.inputClass,
          isExternalClass && 'input-class',
          bem('field__input', [props.inputAlign, {
            disabled: props.disabled, error: props.error
          }])
        )}
        type={props.type}
        focus={props.focus}
        cursor={props.cursor}
        value={displayValue}
        autoFocus={props.autoFocus}
        disabled={props.disabled || props.readonly}
        maxLength={props.maxLength}
        placeholder={props.placeholder}
        placeholderStyle={props.placeholderStyle}
        placeholderClass={props.placeholderClass || bem('field__placeholder', { error: props.error })}
        confirmType={props.confirmType}
        confirmHold={props.confirmHold}
        holdKeyboard={props.holdKeyboard}
        cursorSpacing={props.cursorSpacing}
        adjustPosition={props.adjustPosition}
        selectionEnd={props.selectionEnd}
        selectionStart={props.selectionStart}
        password={props.password}

        onInput={(e) => {
          // const val = e.detail.value === '' ? NaN : Number(e.detail.value);
          if (e.detail.value === '') {
            const val = NaN;
            setValue(val)  // inputValue -> displayValue
            if (props.onInput) {
              props.onInput(val) // inputValue -> value
            }
          } else {
            const val = Number(e.detail.value);
            if (isNaN(val)) {
              return displayValue
            } else if (props.type === "number" && displayValue[displayValue.length - 1] === '.') {
              return displayValue
            } else {
              setValue(val)  // inputValue -> displayValue
              if (props.onInput) {
                props.onInput(val) // inputValue -> value
              }
            }
          }

        }}
        onFocus={(e) => {
          setFocused(true);
          if (props.onFocus) {
            props.onFocus({
              value, height: e.detail.height
            });
          }
        }}
        onBlur={() => {
          setFocused(false)
          if (props.onBlur) {
            props.onBlur({
              value, cursor: 0
            });
          }
        }}
        onConfirm={() => {
          props.onConfirm(value)
        }}
        onKeyboardHeightChange={props.onKeyboardHeightChange}
      />
      {showClear && <View className="van-field__clear-root van-field__icon-root" onTouchStart={(e) => {
        e.stopPropagation()
        setValue(NaN);
        props.onClear()
      }}>
        <VanIcon name="clear" />
      </View>}
      <View className="van-field__icon-container"
        onClick={props.onClickIcon}>
        {(props.rightIcon || props.icon) &&
          <View className={
            classnames(
              "van-field__icon-root",
              isNormalClass && props.iconClass,
              isExternalClass && "icon-class"
            )
          }>
            <VanIcon
              name={(props.rightIcon || props.icon)}
              className={props.rightIconClass}
              custom-class="right-icon-class"
            />
          </View>
        }
        {props.renderRightIcon}
        {props.renderIcon}
      </View>
      {props.useButtonSlot && <View className="van-field__button">
        {props.renderButton}
      </View>}
    </View>
    {(props.showWordLimit && props.maxLength) &&
      <View className="van-field__word-limit">
        <View className={
          bem('field__word-num', { full: (value ? String(value).length : 0) >= props.maxLength })
        }>
          {(value ? String(value).length : 0)} / {props.maxLength}
        </View>
      </View>
    }
    {errorMessage && <View className={
      bem('field__error-message', [props.errorMessageAlign, {
        disabled: props.disabled, error: props.error
      }])
    }>
      {errorMessage}
    </View>}
  </VanCell>;
}

VanFieldNumber.defaultProps = VanFieldDefaultProps
VanFieldNumber.externalClasses = [
  'label-class',
  'input-class',
  'right-icon-class',
  'custom-class',
  'icon-class'
]
export default VanFieldNumber

