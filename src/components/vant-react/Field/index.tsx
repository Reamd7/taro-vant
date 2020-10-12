import { Input, Textarea, View } from "@tarojs/components";
import Taro, { useCallback, useEffect, useMemo, useState } from "@tarojs/taro";
import VanCell, { VanCellProps } from "../Cell";
import { FormField, useFormItem } from "../common/formitem";
import { addUnit, isH5, isWeapp, noop, useMemoBem, useMemoClassNames } from "../common/utils";
import VanIcon from "../icon";
import "./index.less";

function inputStyle(autoSize: VanFieldProps<any>['autoSize']) {
  const style: React.CSSProperties = {}
  if (autoSize) {
    if (autoSize.minHeight) {
      style.minHeight = addUnit(autoSize.minHeight)
    }
    if (autoSize.maxHeight) {
      style.maxHeight = addUnit(autoSize.maxHeight)
    }
  }
  return style
}

type VanFieldPropsEvt<T> = {
  onInput?: (val: T) => unknown;
  onChange?: (val: T) => unknown;
  onConfirm?: (val: T) => unknown;
  onClickIcon?: React.ComponentProps<typeof View>['onClick'];
  onFocus?: (data: {
    value: T; height: number;
  }) => unknown;
  onBlur?: (
    data: {
      value: T; cursor: number;
    }
  ) => unknown;
  onClear?: () => unknown;
  onLineChange?: React.ComponentProps<typeof Textarea>['onLineChange'];
  onKeyboardHeightChange?: React.ComponentProps<typeof Textarea>['onKeyboardHeightChange'];
}

type VanFieldStringProps<Key extends string> = {
  type?: "text" | "idcard" | "textarea" | 'password'

} & FormField<Key, string> & VanFieldPropsEvt<string>;

type VanFieldNumberProps<Key extends string> = {
  type: "number" | "digit"
} & FormField<Key, number> & VanFieldPropsEvt<number>;

type VanFieldCommonProps = {
  // ============= commonProps ==============
  placeholder?: string;
  placeholderStyle?: string;
  placeholderClass?: string;
  disabled?: boolean;
  maxLength?: number;
  cursorSpacing?: number;
  autoFocus?: boolean;
  focus?: boolean;
  cursor?: number;
  selectionStart?: number;
  selectionEnd?: number;
  adjustPosition?: boolean;
  holdKeyboard?: boolean;
  // ================== inputProps =================
  password?: boolean;
  confirmType?: React.ComponentProps<typeof Input>['confirmType'];
  confirmHold?: React.ComponentProps<typeof Input>['confirmHold'];
  // ================= textareaProps ==================
  autoHeight?: boolean;
  fixed?: boolean;
  showConfirmbar?: boolean;
  disableDefaultPadding?: boolean;
  // ===================================
  size?: VanCellProps['size'];
  icon?: string;
  label?: string;
  error?: boolean;
  center?: boolean;
  isLink?: boolean;
  leftIcon?: VanCellProps['icon'];
  rightIcon?: string;
  autoSize?: false | {
    maxHeight: number;
    minHeight: number;
  }
  required?: boolean;
  iconClass?: string;
  clickable?: boolean;
  inputAlign?: "center" | "right" | "left";
  customStyle?: React.CSSProperties;
  errorMessage?: string;
  arrowDirection?: "left" | "up" | "down";
  shwoWordLimit?: boolean;
  errorMessageAlign?: "center" | "right" | "left";
  readonly?: boolean;
  clearable?: boolean;
  border?: boolean;
  titleWidth?: VanCellProps['titleWidth'];

  renderLabel?: React.ReactNode;
  renderIcon?: React.ReactNode;
  renderLeftIcon?: React.ReactNode;
  renderRightIcon?: React.ReactNode;
  renderButton?: React.ReactNode;

  labelClass?: string
  inputClass?: string
  rightIconClass?: string
  className?: string;
  ['label-class']?: string;
  ['input-class']?: string;
  ['right-icon-class']?: string;
  ['custom-class']?: string;
}

export type VanFieldProps<Key extends string> = (VanFieldStringProps<Key> | VanFieldNumberProps<Key>) & VanFieldCommonProps

const isVanFieldStringProps = <Key extends string>(props: VanFieldProps<Key>): props is VanFieldStringProps<Key> & VanFieldCommonProps => {
  return props.type === "number" || props.type === "digit"
}

export default function VanField<Key extends string>(props: VanFieldProps<Key>) {
  const {
    maxLength = -1,
    cursorSpacing = 50,
    cursor = -1,
    selectionStart = -1,
    selectionEnd = -1,
    adjustPosition = true,
    type = "text",
    showConfirmbar = true,
    disableDefaultPadding = true,
    border = true,
    titleWidth = "6.2em",

    disabled,
    errorMessageAlign,
    error
  } = props;
  const bem = useMemoBem();
  const classnames = useMemoClassNames();

  const {
    FormData,
    fieldName,
    value: propsValue,
    defaultValue
  } = props;

  const format = useCallback((val: string | number | undefined) => {
    if (val === undefined) return '';
    switch (type) {
      case "text":
      case "textarea":
      case "number":
      case "digit":
      case "idcard":
        return String(val);
      case "password":
        return String(val).split("").map(() => "*").join("");
    }
  }, [type]);

  const deFormat = useCallback((val: string) => {
    switch (type) {
      case "text":
      case "textarea":
      case "idcard":
        return String(val);
      case "password":
        return String(val).split("").map(() => "*").join("");
      case "number":
      case "digit":
        return Number(val);
    }
  }, [type])

  const [value, , setValueAndChange] = useFormItem({
    FormData,
    fieldName,
    value: propsValue,
    defaultValue
  });
  const [focused, setFocused] = useState(false);
  const [innerValue, setInnerValue] = useState<string>(format(value));
  useEffect(() => {
    setInnerValue(format(value))
  }, [value, format])

  const {
    clearable,
    readonly
  } = props;

  const showClear = useMemo(() => !!clearable && !!focused && !!value && !readonly, [clearable, readonly, focused, value])


  return <VanCell
    size={props.size}
    icon={props.leftIcon}
    center={props.center}
    border={border}
    isLink={props.isLink}
    required={props.required}
    clickable={props.clickable}
    titleWidth={titleWidth}
    titleStyle={{
      marginRight: 12
    }}
    customStyle={props.customStyle}
    arrowDirection={props.arrowDirection}
    custom-class="van-field"
    className="van-field"
    title-class="label-class"
    titleClass="label-class"
    renderIcon={
      props.renderLeftIcon
    }
    renderTitle={
      props.label ? <View className={
        bem(
          'field__label', { disabled }
        )
      }>
        {props.label}
      </View> : props.renderLabel
    }
  >
    <View className={
      bem('field__body', [type])
    }>
      {type === "textarea" ?
        <Textarea className={classnames(
          isH5 && props.inputClass,
          isWeapp && 'input-class',
          bem('field__input', [props.inputAlign, type, { disabled, error }])
        )}
          fixed={props.fixed}
          focus={props.focus}
          cursor={cursor}
          value={value as string | undefined} // 这里是对的
          autoFocus={props.autoFocus}
          disabled={props.disabled || props.readonly}
          maxlength={maxLength}
          placeholder={props.placeholder}
          placeholderStyle={props.placeholderStyle}
          placeholderClass={props.placeholderClass || bem('field__placeholder', { error, disabled })}
          autoHeight={!!props.autoSize}
          style={inputStyle(props.autoSize)}
          cursorSpacing={cursorSpacing}
          adjustPosition={adjustPosition}
          showConfirmBar={showConfirmbar}
          holdKeyboard={props.holdKeyboard}
          selectionEnd={selectionEnd}
          selectionStart={selectionStart}
          disableDefaultPadding={disableDefaultPadding}
          onInput={(e) => {
            setInnerValue(e.detail.value);
            if (props.onInput) {
              if (isVanFieldStringProps(props)) {
                props.onInput(e.detail.value);
              } else {
                // props.onInput(e.detail.value);
              }
            }
          }}
          onBlur={(e) => {
            setFocused(false)
            setValueAndChange(deFormat(innerValue))

            if (props.onBlur) {
              if (isVanFieldStringProps(props)) {
                props.onBlur({
                  value: deFormat(innerValue) as string,
                  cursor: 0
                });
              } else {
                props.onBlur({
                  value: deFormat(innerValue) as number,
                  cursor: 0
                });
              }
            }
          }}
          onFocus={(e) => {
            setFocused(false)
            if (props.onFocus) {
              if (isVanFieldStringProps(props)) {
                props.onFocus({
                  value: value as string,
                  height: e.detail.height
                });
                // deformat

              }
            }
          }}
          onConfirm={() => {
            if (props.onConfirm) {
              if (isVanFieldStringProps(props)) {
                props.onConfirm(value as string)
              } else {
                props.onConfirm(value as number)
              }
            }
          }}
          onLineChange={props.onLineChange || noop}
          onKeyboardHeightChange={props.onKeyboardHeightChange || noop}
        /> :

        <Input className={classnames(
          isH5 && props.inputClass,
          isWeapp && 'input-class',
          bem('field__input', [props.inputAlign, { disabled, error }])
        )}
          focus={props.focus}
          cursor={cursor}
          value={innerValue}
          autoFocus={props.autoFocus}
          disabled={props.disabled || props.readonly}
          maxLength={maxLength}
          placeholder={props.placeholder}
          placeholderStyle={props.placeholderStyle}
          placeholderClass={props.placeholderClass || bem('field__placeholder', { error })}
          confirmType={props.confirmType}
          confirmHold={props.confirmHold}
          holdKeyboard={props.holdKeyboard}
          cursorSpacing={cursorSpacing}
          adjustPosition={adjustPosition}
          selectionEnd={selectionEnd}
          selectionStart={selectionStart}
          password={props.password || type === 'password'}

          onInput={(e) => {
            setInnerValue(e.detail.value);
            if (props.onInput) {
              if (isVanFieldStringProps(props)) {
                props.onInput(e.detail.value);
              } else {
                props.onInput(Number(e.detail.value));
              }
            }
          }}
          onBlur={(e) => {
            setFocused(false)
            if (props.onBlur) {
              if (isVanFieldStringProps(props)) {
                props.onBlur({
                  value: deFormat(innerValue) as string,
                  cursor: 0
                });
              }
            }
          }}
          onFocus={(e) => {
            setFocused(false)
            if (props.onFocus) {
              if (isVanFieldStringProps(props)) {
                props.onFocus({
                  value: value as string,
                  height: e.detail.height
                });
                // deformat
              } else {
                props.onFocus({
                  value: value as number,
                  height: e.detail.height
                });
                // deformat
              }
            }
          }}
          onConfirm={() => {
            if (props.onConfirm) {
              if (isVanFieldStringProps(props)) {
                props.onConfirm(value as string)
              } else {
                props.onConfirm(value as number)
              }
            }
          }}
          onKeyboardHeightChange={props.onKeyboardHeightChange || noop}
        />
      }
      {showClear && <View className="van-field__clear-root van-field__icon-root" onTouchStart={(e) => {
        e.stopPropagation()
      }}>
        <VanIcon name="clear" />
      </View>}
      <View className="van-field__icon-container"
        onClick={props.onClickIcon || noop}>
        {(props.rightIcon || props.icon) &&
          <View className={
            classnames(
              "van-field__icon-root",
              props.iconClass
            )
          }>
            <VanIcon
              name={(props.rightIcon || props.icon)} className="right-icon-class" custom-class="right-icon-class"
            />
          </View>
        }
        {props.renderRightIcon}
        {props.renderIcon}
      </View>
      <View className="van-field__button">
        {props.renderButton}
      </View>
    </View>
    {(props.shwoWordLimit && props.maxLength) && <View className="van-field__word-limit">
      <View className={
        bem('field__word-num', { full: (value ? String(value).length : 0) >= props.maxLength })
      }>
        {(value ? String(value).length : 0)} / {props.maxLength}
      </View>
    </View>}
    {props.errorMessage && <View className={
      bem('field__error-message', [errorMessageAlign, { disabled, error }])
    }>
      {props.errorMessage}
    </View>}
  </VanCell>
}

VanField.options = {
  addGlobalClass: true
}

