import Taro from "@tarojs/taro";
const { useMemo } = Taro /** api **/;
import "./index.less";
import VanIcon, { VanIconProps } from "../icon";
import { View, Text } from "@tarojs/components";
import { useMemoClassNames, isExternalClass, isNormalClass, noop, ActiveProps, getSystemInfoSync } from "../common/utils";
import VanButton, { VanButtonProps } from "../Button";

export type VanSubmitBarProps = {
  'bar-class'?: string;
  'price-class'?: string;
  'button-class'?: string;
  'custom-class'?: string;
  barClass?: string;
  priceClass?: string;
  buttonClass?: string;
  className?: string;
} & {
  children?: React.ReactNode
  renderButton?: React.ReactNode;
  renderTop?: React.ReactNode;
  renderTips?: React.ReactNode;
} & {
  price?: number;
  label?: string;
  textAlign?: "left" | "center" | "right";
  suffixLabel?: string;
  buttonText?: string;
  buttonType?: VanButtonProps['type'];
  buttonColor?: string;
  tip?: string | boolean;
  tipIcon?: VanIconProps['name'];
  disabled?: VanButtonProps['disabled'];
  loading?: VanButtonProps['loading'];
  currency?: string;
  safeAreaInsetBottom?: boolean;
  decimalLength?: number;

  onSubmit?: VoidFunction;
}

const DefaultProps = {
  label: "合计：",
  textAlign: "right",
  buttonType: "danger",
  currency: "¥",
  disabled: false,
  loading: false,
  safeAreaInsetBottom: true,
  onSubmit: noop
} as const



type ActiveVanSubmitBarProps = ActiveProps<VanSubmitBarProps, keyof typeof DefaultProps>


const VanSubmitBar: Taro.FunctionComponent<VanSubmitBarProps> = (props: ActiveVanSubmitBarProps) => {
  const {
    price,
    label,
    textAlign,
    suffixLabel,
    buttonText,
    buttonType,
    buttonColor,
    tip,
    tipIcon,
    disabled,
    loading,
    currency,
    safeAreaInsetBottom,
    decimalLength,
  } = props;

  const classnames = useMemoClassNames();
  const dpr = getSystemInfoSync().pixelRatio;
  const hasTip = useMemo(() => typeof tip === "string", [tip]);
  const {
    integerStr, decimalStr,
    hasPrice
  } = useMemo(() => {
    const priceStrArr =
      typeof price === 'number' &&
      (price / 100).toFixed(decimalLength).split('.');
    return {
      hasPrice: typeof price === 'number',
      integerStr: priceStrArr && priceStrArr[0],
      decimalStr: decimalLength && priceStrArr ? `.${priceStrArr[1]}` : '',
    }
  }, [price, decimalLength])

  return <View
    className={classnames(
      "van-submit-bar",
      isExternalClass && "custom-class",
      isNormalClass && props.className
    )}
  >
    {props.renderTop}
    <View className="van-submit-bar__tip">
      {tipIcon && <VanIcon
        name={tipIcon}
        custom-class="van-submit-bar__tip-icon"
        className="van-submit-bar__tip-icon"
      />}
      {hasTip ? <View className="van-submit-bar__tip-text">
        {tip}
      </View> : props.renderTips}
    </View>
    <View className={
      classnames(
        "van-submit-bar__bar",
        isNormalClass && props.barClass,
        isExternalClass && "bar-class"
      )
    }>
      {props.children}
      {hasPrice && <View className="van-submit-bar__text" style={{
        textAlign,
      }}>
        <Text>{label || '合计：'}</Text>
        <Text className={
          classnames(
            "van-submit-bar__price",
            isExternalClass && "price-class",
            isNormalClass && props.priceClass
          )
        }>
          <Text className="van-submit-bar__currency">{currency} </Text>
          <Text className="van-submit-bar__price-integer">{integerStr}</Text>
          <Text>{decimalStr}</Text>
        </Text>
        <Text className="van-submit-bar__suffix-label">{suffixLabel}</Text>
      </View>}
      <View className="van-submit-bar__button">
        <VanButton
          round
          type={buttonType}
          loading={loading}
          disabled={disabled}
          color={buttonColor}
          className={props.buttonClass}
          custom-class="button-class"
          style={{
            width: "100%"
          }}
          onClick={props.onSubmit}
        >
          {loading ? '' : buttonText}
        </VanButton>
      </View>

    </View>
    {safeAreaInsetBottom && <View className="van-submit-bar__safe" />}
  </View >
}

VanSubmitBar.options = {
  addGlobalClass: true
}
VanSubmitBar.defaultProps = DefaultProps;
VanSubmitBar.externalClasses =
  ['bar-class', 'price-class', 'button-class', 'custom-class'];
export default VanSubmitBar;
