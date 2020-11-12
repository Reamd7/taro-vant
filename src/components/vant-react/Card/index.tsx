import Taro, { useMemo } from "@tarojs/taro";
import { Image, View, Text } from "@tarojs/components";
import "./index.less";
import { useMemoClassNames, isH5, isWeapp, useMemoBem, ActiveProps } from "../common/utils";
import VanTag from "../Tag";
import { useLink } from "../common/mixins/link";

export type VanCardProps = {
  thumb?: string;
  thumbMode?: React.ComponentProps<typeof Image>['mode'];
  title?: string;
  desc?: string;
  tag?: string;
  num?: number | string;
  price?: number | string;
  originPrice?: number | string;
  centered?: boolean;
  currency?: string;
  thumbLink?: string;
  linkType?: "redirectTo" | "switchTab" | "reLaunch" | "navigateTo";
  lazyLoad?: boolean;

  renderTitle?: React.ReactNode;
  renderDesc?: React.ReactNode;
  renderNum?: React.ReactNode;
  renderPrice?: React.ReactNode;
  renderOriginPrice?: React.ReactNode;
  renderPriceTop?: React.ReactNode;
  renderBottom?: React.ReactNode;
  renderThumb?: React.ReactNode;
  renderTag?: React.ReactNode;
  renderTags?: React.ReactNode;
  renderFooter?: React.ReactNode;

  className?: string;
  ['custom-class']?: string;
  thumbClass?: string;
  ['thumb-class']?: string;
  titleClass?: string;
  ['title-class']?: string;
  priceClass?: string;
  ['price-class']?: string;
  originPriceClass?: string;
  ['origin-price-class']?: string;
  descClass?: string;
  ['desc-class']?: string;
  numClass?: string;
  ['num-class']?: string;
}

const DefaultProps = {
  price: "",
  thumbMode: "aspectFit",
  centered: false,
  currency: "¥",
  linkType: "navigateTo",
  lazyLoad: false
} as const
type ActiveVanCardProps = ActiveProps<VanCardProps, keyof typeof DefaultProps>

const VanCard: Taro.FunctionComponent<VanCardProps> = (props: ActiveVanCardProps) => {
  const classnames = useMemoClassNames();
  const bem = useMemoBem();

  const {
    centered, thumb, thumbMode, lazyLoad, tag,

    title, desc, price, currency, originPrice, num,

  } = props;

  const {
    integerStr, decimalStr
  } = useMemo(() => {
    const priceArr = price.toString().split('.');
    return ({
      integerStr: priceArr[0],
      decimalStr: priceArr[1] ? `.${priceArr[1]}` : '',
    });
  }, [price])

  const jumpLink = useLink(props, "thumbLink")

  return <View className={classnames(
    isH5 && props.className,
    isWeapp && "custom-class",
    "van-card"
  )}>
    <View className={
      bem('card__header', { center: centered })
    }>
      <View className="van-card__thumb" onClick={jumpLink}>
        {thumb ? <Image
          src={thumb} mode={thumbMode} lazyLoad={lazyLoad} className="van-card__img thumb-class"
        /> : props.renderThumb}
        {tag ? <VanTag mark type="danger" custom-class="van-card__tag" className="van-card__tag">{tag}</VanTag> : props.renderTag}
      </View>
      <View className={
        classnames(
          "van-card__content",
          bem('card__content', { center: centered })
        )
      }>
        <View>
          {title ? <View className={classnames(
            "van-card__title",
            isH5 && props.titleClass,
            isWeapp && "title-class"
          )}>{title}</View> : props.renderTitle}
          {
            desc ? <View className={classnames(
              "van-card__desc",
              isH5 && props.descClass,
              isWeapp && "desc-class"
            )}>{desc}</View> : props.renderDesc
          }
          {props.renderTags}
        </View>
        <View className="van-card__bottom">
          {props.renderPriceTop}
          {
            (price || price === 0) ?
              <View className={
                classnames(
                  "van-card__price",
                  isH5 && props.priceClass,
                  isWeapp && "price-class"
                )
              }>
                <Text>{currency}</Text>
                <Text className="van-card__price-integer">{integerStr}</Text>
                <Text className="van-card__price-decimal">{decimalStr}</Text>
              </View> : props.renderPrice
          }
          {
            (originPrice || originPrice === 0) ?
              <View className={
                classnames(
                  "van-card__origin-price",
                  isH5 && props.originPriceClass,
                  isWeapp && "origin-price-class"
                )
              }>
                {currency}{originPrice}
              </View> : props.renderOriginPrice
          }
          {num ? <View className={
            classnames(
              "van-card__num",
              isWeapp && "num-class",
              isH5 && props.numClass
            )
          }>x {num}</View> : props.renderNum}
          {props.renderBottom}
        </View>
      </View>
    </View>
    <View className="van-card__footer">
      {props.renderFooter}
    </View>
  </View>
}

VanCard.options = {
  addGlobalClass: true
}
VanCard.defaultProps = DefaultProps;

export default VanCard
