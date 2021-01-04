import Taro from "@tarojs/taro";
const { useState, useEffect, useMemo, useCallback } = Taro /** api **/;
import "./index.less";
import VanCell from "../Cell";
import { useMemoClassNames, bem, isExternalClass, isNormalClass } from "../utils"
import { View, Input, Text } from "@tarojs/components";
import useControllableValue from "../hooks/useControllableValue"
import { VanFieldDefaultProps, VanFieldInputTextProps, ActiveVanFieldInputTextProps, VanCellContainerTitleStyle, externalClasses } from "./common";
import VanIcon from "../icon";

const numberReg = /^(0|[1-9][0-9]*|-[1-9][0-9]*)$/;

const digitReg = /^[-]?(0|([1-9]\d*))(\.\d*)?$/; // 允许0. 的格式

const VanFieldText: Taro.FunctionComponent<
  VanFieldInputTextProps
> = (props: ActiveVanFieldInputTextProps) => {

  const classnames = useMemoClassNames();


  const [value, setValue] = useControllableValue(props, {
    defaultValue: "",
  })
  const [focused, setFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>(""); // 显示值;
  useEffect(() => {
    setDisplayValue(value); // value -> displayValue
  }, [value])

  const showClear = useMemo(() => !!props.clearable && !!focused && !!value && !props.readonly, [props.clearable, props.readonly, focused, value]);

  const onInput = useCallback((val?: string) => {
    setValue(val || '') // inputValue -> displayValue
    if (props.onInput) {
      props.onInput(val || '') // inputValue -> value
    }
  }, [setValue, props.onInput])

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
    useTitleSlot={!!props.label || props.useLabelSlot}
    renderTitle={
      props.label ? <View className={
        bem('field__label', { disabled: props.disabled })
      }>
        <Text>{props.label}</Text>
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
        type={props.type === "password" ? "text" : props.type}
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
        password={props.password || props.type === "password"}

        onInput={(e) => {
          if (e.detail.value === "") {
            onInput(e.detail.value)
            return e.detail.value
          }
          else if (props.type === "number") {
            if (numberReg.test(e.detail.value)) {
              onInput(e.detail.value)
              return e.detail.value;
            } else {
              return value
            }
          }
          else if (props.type === "digit") {
            if (digitReg.test(e.detail.value)) {
              onInput(e.detail.value)
              return e.detail.value;
            } else {
              return value
            }
          } else {
            onInput(e.detail.value)
            return e.detail.value;
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

        setValue('');
        // TODO  onClear
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
    {props.errorMessage && <View className={
      bem('field__error-message', [props.errorMessageAlign, {
        disabled: props.disabled, error: props.error
      }])
    }>
      {props.errorMessage}
    </View>}
  </VanCell>;
}

VanFieldText.defaultProps = VanFieldDefaultProps
VanFieldText.externalClasses = [
  'label-class',
  'input-class',
  'right-icon-class',
  'custom-class',
  'icon-class'
]
export default VanFieldText

