import { VanFieldProps } from ".";
import { addUnit, noop } from "../common/utils";
import { Input, Textarea, View } from "@tarojs/components";
import VanCell, { VanCellProps } from "../Cell";
import VanIcon from "../icon";
import { ControllerValueProps } from "src/common/hooks/useControllableValue";

type FieldSlotType = {
  useLabelSlot?: boolean;
  renderLabel?: React.ReactNode;
  renderIcon?: React.ReactNode;
  renderLeftIcon?: React.ReactNode;
  renderRightIcon?: React.ReactNode;
  renderButton?: React.ReactNode;
  children?: React.ReactNode;
}

export function inputStyle(autoSize: VanFieldProps<any>['autoSize']) {
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

/**
 * 事件
 */
type VanFieldPropsEvt<T> = {
  onInput?: (val: T) => unknown;
  onChange?: (val: T) => unknown;
  onConfirm?: (val: T) => unknown;
  onFocus?: (data: {
    value: T; height: number;
  }) => unknown;
  onBlur?: (
    data: {
      value: T; cursor: number;
    }
  ) => unknown;
  onClear?: () => unknown;
}
/**
 * Input Props
 */
type VanFieldInputProps = Pick<
  React.ComponentProps<typeof Input>,
  "focus" | "cursor" | "autoFocus" | "confirmType" |
  "confirmHold" | "placeholder" | "placeholderClass" | "placeholderStyle" |
  "disabled" | "holdKeyboard" | "cursorSpacing" | "selectionStart" | "selectionEnd" | "adjustPosition" |
  "password" | "onKeyboardHeightChange"
> & {
  readonly?: React.ComponentProps<typeof Input>['disabled'];
}
/**
 * TextArea Props
 */
type VanFieldTextareaProps = Pick<
  React.ComponentProps<typeof Textarea>,
  "fixed" | "focus" | "cursor" | "autoFocus" | "autoHeight" | 'showConfirmBar' |
  "placeholder" | "placeholderClass" | "placeholderStyle" |
  "disabled" | "cursorSpacing" | "adjustPosition" | "holdKeyboard" | "selectionStart" | "selectionEnd" | "disableDefaultPadding" | "onLineChange" | "onKeyboardHeightChange"
> & {
  readonly?: React.ComponentProps<typeof Textarea>['disabled'];
}
/**
 * Cell Container
 */
type VanFieldCellContainerProps = Pick<
  React.ComponentProps<typeof VanCell>,
  "size" | "isLink" | "required" | "clickable" | "titleWidth" |
  "customStyle" | "arrowDirection" | "border" | "center"
> & {
  lefeIcon?: VanCellProps['icon'];
  label?: string;
}
/**
 * Common
 */
type VanFieldCommonProps = {
  // ========================= common ============================
  inputAlign?: "center" | "right" | "left";
  maxLength?: number; // word limit
  showWordLimit?: boolean; // word limit
  autoSize?: boolean | {
    maxHeight: number;
    minHeight: number;
  }
  // ========================= clearIcon =========================
  clearable?: boolean;
  // ========================= RightIcon =========================
  rightIcon?: React.ComponentProps<typeof VanIcon>['name'];
  icon?: React.ComponentProps<typeof VanIcon>['name'];
  onClickIcon?: React.ComponentProps<typeof View>['onClick']
  renderRightIcon?: React.ReactNode;
  renderIcon?: React.ReactNode;
  // ========================= renderButton ======================
  useButtonSlot?: boolean
  renderButton?: React.ReactNode;
  // ========================= error =============================
  errorMessage?: string;
  errorMessageAlign?: "center" | "right" | "left";
  error?: boolean;
} & externalClassesType & FieldSlotType

type externalClassesType = {
  labelClass?: string
  inputClass?: string
  rightIconClass?: string
  className?: string
  iconClass?: string
  'icon-class'?: string
  'label-class'?: string
  'input-class'?: string
  'right-icon-class'?: string
  'custom-class'?: string
}
export const externalClasses = [
  'label-class',
  'input-class',
  'right-icon-class',
  'custom-class',
  'icon-class'
]
export const VanFieldDefaultProps = {
  border: true,
  titleWidth: "6.2em",
  cursor: -1,
  maxLength: -1,
  cursorSpacing: 50,
  adjustPosition: true,
  selectionEnd: -1,
  selectionStart: -1,
  onKeyboardHeightChange: noop,
  onClickIcon: noop,
  onClear: noop,
  onConfirm: noop,
  onFocus: noop,
  onBlur: noop,
} as const;

type VanFieldInputTextDefaultPropsKeys = Exclude<keyof typeof VanFieldDefaultProps, never>;
type VanFieldInputTextAreaDefaultPropsKeys = Exclude<keyof typeof VanFieldDefaultProps, "onKeyboardHeightChange">;


export type VanFieldInputTextProps = VanFieldCommonProps & VanFieldCellContainerProps & VanFieldInputProps & VanFieldPropsEvt<string> & ControllerValueProps<string, "defaultValue", "value", "onChange"> & {
  type: "text" | "idcard" | 'password' | "number" | "digit"
}
export type ActiveVanFieldInputTextProps = Omit<VanFieldInputTextProps, VanFieldInputTextDefaultPropsKeys> & Required<Pick<VanFieldInputTextProps, VanFieldInputTextDefaultPropsKeys>>;

export type VanFieldInputNumberProps = VanFieldCommonProps & VanFieldCellContainerProps & VanFieldInputProps & VanFieldPropsEvt<number> & ControllerValueProps<number, "defaultValue", "value", "onChange"> & {
  type: "number" | "digit"
}
export type ActiveVanFieldInputNumberProps = Omit<VanFieldInputNumberProps, VanFieldInputTextDefaultPropsKeys> & Required<Pick<VanFieldInputNumberProps, VanFieldInputTextDefaultPropsKeys>>;

export type VanFieldTextAreaTextProps = VanFieldCommonProps & VanFieldCellContainerProps & VanFieldTextareaProps & VanFieldPropsEvt<string> & ControllerValueProps<string, "defaultValue", "value", "onChange"> & {
  type: "textarea"
}
export type ActiveVanFieldTextAreaTextProps = Omit<VanFieldTextAreaTextProps, VanFieldInputTextAreaDefaultPropsKeys> &
  Required<Pick<VanFieldTextAreaTextProps, VanFieldInputTextAreaDefaultPropsKeys>>;


export const VanCellContainerTitleStyle = {
  marginRight: 12
} as const
