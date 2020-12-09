import Taro from "@tarojs/taro";
import { useState, useEffect, useMemo } from '@tarojs/taro' /** api **/;
import "./index.less";
import VanCell from "../Cell";
import { useMemoClassNames, useMemoBem, isExternalClass, isNormalClass, addUnit } from "../common/utils";
import { View, Textarea } from "@tarojs/components";
import useControllableValue from "src/common/hooks/useControllableValue";
import { VanFieldDefaultProps, VanFieldTextAreaTextProps, ActiveVanFieldTextAreaTextProps, VanCellContainerTitleStyle, externalClasses } from "./common";
import VanIcon from "../icon";

// function inputStyle(autoSize: VanFieldTextAreaTextProps['autoSize']) {
//   if (typeof autoSize === "object") {
//     const style: React.CSSProperties = {}
//     if (autoSize.minHeight) {
//       style.minHeight = addUnit(autoSize.minHeight)
//     }
//     if (autoSize.maxHeight) {
//       style.maxHeight = addUnit(autoSize.maxHeight)
//     }
//     return style
//   }
//   return undefined;
// }
const VanFieldTextarea: Taro.FunctionComponent<
  VanFieldTextAreaTextProps
> = (props: ActiveVanFieldTextAreaTextProps) => {

  const classnames = useMemoClassNames();
  const bem = useMemoBem();

  const [value, setValue] = useControllableValue(props, {
    defaultValue: "",
  })
  const [focused, setFocused] = useState(props.focus);
  const [displayValue, setDisplayValue] = useState<string>(""); // 显示值;
  useEffect(() => {
    setDisplayValue(value); // value -> displayValue
  }, [value])

  const showClear = useMemo(() => !!props.clearable && !!focused && !!value && !props.readonly, [props.clearable, props.readonly, focused, value]);

  // const [TextAreaHeight, setTextAreaHeight] = useState(0);

  const TextareaStyle = useMemo(() => {
    let autoSize = props.autoSize
    if (typeof autoSize === "object") {
      // @cell-line-height: 24px * @dpi;
      // const dpr = getSystemInfoSync().pixelRatio;

      const lineHeight = autoSize.lineHeight || 1.2
      const style: React.CSSProperties = {
        height: (value.length - value.replace(/\n/g, '').length + 1) * lineHeight + "em",
        lineHeight: lineHeight
      }
      if (autoSize.minHeight) {
        style.minHeight = addUnit(autoSize.minHeight)
      }
      if (autoSize.maxHeight) {
        style.maxHeight = addUnit(autoSize.maxHeight)
      }
      return style
    }
    return undefined;
  }, [props.autoSize, value]);

  // 奇怪的操作。
  // const TextQuery = useRef<Taro.SelectorQuery>();

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
    renderTitle={
      props.label ? <View className={
        bem('field__label', { disabled: props.disabled })
      }>
        {props.label}
      </View> : props.renderLabel
    }
    onClick={(e) => {
      if (!focused) {
        setFocused(true);
        if (props.onFocus) {
          props.onFocus({
            value, height: e.detail.height
          });
        }
      }
    }}
  >
    <View className={
      bem('field__body', [props.type])
    }>
      {/* {focused ? null : <View
        className={classnames(
          isNormalClass && props.inputClass,
          isExternalClass && 'input-class',
          bem('field__input', [props.inputAlign, {
            disabled: props.disabled, error: props.error
          }])
        )}
        style={{ ...TextareaStyle, flex: 1, wordBreak: 'break-all', height: TextAreaHeight + "px" }}
      >
        {displayValue ?
          <Text>{displayValue}</Text> :
          <Text
            style={props.placeholderStyle}
            className={props.placeholderClass || bem('field__placeholder', { error: props.error })}
          >{props.placeholder}</Text>}
      </View>} */}
      <Textarea
        // ref={(ref: Taro.NodesRef) => {
        //   // debugger;
        //   TextQuery.current = ref.fields({
        //     // dataset: true,
        //     size: true,
        //     // scrollOffset: true,
        //     // properties: ['scrollX', 'scrollY'],
        //     // computedStyle: ['margin', 'backgroundColor'],
        //     // context: true,
        //   }, function (res) {
        //     console.log(res.height)
        //     setTextAreaHeight(
        //       res.height
        //     )
        //   })

        //   TextQuery.current.exec()
        // }}
        className={classnames(
          isNormalClass && props.inputClass,
          isExternalClass && 'input-class',
          bem('field__input', [props.inputAlign, {
            disabled: props.disabled, error: props.error
          }])
        )}
        focus={focused}
        cursor={props.cursor}
        value={displayValue}
        autoFocus={props.autoFocus}
        disabled={props.disabled || props.readonly}
        maxlength={props.maxLength}
        placeholder={props.placeholder}
        placeholderStyle={props.placeholderStyle}
        placeholderClass={props.placeholderClass || bem('field__placeholder', { error: props.error })}
        autoHeight={!!props.autoSize}
        style={{
          ...TextareaStyle,
          // display: focused ? "block" : "none"
        }}
        cursorSpacing={props.cursorSpacing}
        adjustPosition={props.adjustPosition}
        showConfirmBar={props.showConfirmBar}
        holdKeyboard={props.holdKeyboard}
        selectionEnd={props.selectionEnd}
        selectionStart={props.selectionStart}
        disableDefaultPadding={props.disableDefaultPadding}
        onInput={(e) => {
          setValue(e.detail.value || '') // inputValue -> displayValue
          // TextQuery.current && TextQuery.current.exec()
          if (props.onInput) {
            props.onInput(e.detail.value) // inputValue -> value
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

VanFieldTextarea.defaultProps = VanFieldDefaultProps
VanFieldTextarea.externalClasses = externalClasses
export default VanFieldTextarea

