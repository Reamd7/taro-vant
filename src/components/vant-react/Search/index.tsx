import Taro from "@tarojs/taro";

import "./index.less";
import { useMemoBem, useMemoAddUnit, useMemoClassNames, isH5, isWeapp } from "../common/utils";
import { View } from "@tarojs/components";
import VanField, { VanFieldProps } from "../Field";
import { VanCellProps } from "../Cell";

export type VanSearchProps = {
  'custom-class'?: string;
  className?: string;
  'field-class'?: string;
  fieldClass?: string;
  'input-class'?: string;
  inputClass?: string;
  'cancel-class'?: string;
  cancelClass?: string;

  label?: string;
  focus?: boolean;
  error?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  inputAlign?: VanFieldProps<any>['inputAlign'];
  showAction?: boolean;
  useActionSlot?: boolean;
  useLeftIconSlot?: boolean;
  useRightIconSlot?: boolean;
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
  renderLeftIcon?: React.ReactNode;
  renderRightIcon?: React.ReactNode;
  renderAction?: React.ReactNode;
}

const VanSearch: Taro.FunctionComponent<VanSearchProps> = (props) => {
  const {
    leftIcon = "search",
    actionText = "取消",
    background = "#ffffff",
    maxLength = -1,
    shape = "square",
    clearable = true
  } = props

  const bem = useMemoBem();
  const addUnit = useMemoAddUnit();
  const classname = useMemoClassNames();

  return <View
    className={
      classname(
        bem('search', { withaction: props.showAction || props.useActionSlot }),
        isH5 && props.className,
        isWeapp && 'custom-class'
      )
    }
    style={{ background }}
  >
    <View className={bem('search__content', [shape])}>
      {props.label ?
        <View className="van-search__label">{props.label}</View> :
        props.renderLabel}
      <View className={
        classname(
          "van-search__field",
          isH5 && props.fieldClass,
          isWeapp && 'field-class'
        )
      }>
        <VanField
          type="search"
          leftIcon={!props.useLeftIconSlot ? leftIcon : ''}
          rightIcon={!props.useRightIconSlot ? props.rightIcon : ''}
          focus={props.focus}
          error={props.error}
          border={false}
          confirmType="search"

          disabled={props.disabled}
          readonly={props.readonly}
          clearable={clearable}
          maxLength={maxLength}
          inputAlign={props.inputAlign}
          inputClass="input-class"
          input-class="input-class"
          placeholder={props.placeholder}
          placeholderStyle={props.placeholderStyle}
          customStyle={{
            padding: `${addUnit(5)} ${addUnit(10)} ${addUnit(5)} 0`,
            backgroundColor: 'transparent'
          }}
          // bind:blur="onBlur"
          // bind:focus="onFocus"
          // bind:change="onChange"
          // bind:confirm="onSearch"
          // bind:clear="onClear"

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
              <View onClick="onCancel" className="cancel-class">
                {actionText}
              </View>
          }

        </View>}
    </View>
  </View >
}

VanSearch.options = {
  addGlobalClass: true
}

export default VanSearch;
