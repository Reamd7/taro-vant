import Taro from "@tarojs/taro";
import "./index.less";
import { bem, isExternalClass, isNormalClass, useMemoClassNames } from "taro-vant/utils"
import { View } from "@tarojs/components";

export type VanGoodsActionProps = {
  safeAreaInsetBottom?: boolean;

  className?: string;
  'custom-class'?: string;
}

type ActiveVanGoodsActionProps = {
  safeAreaInsetBottom: boolean;

  className?: string;
  'custom-class'?: string;
  children?: React.ReactNode
}

const VanGoodsAction: Taro.FunctionComponent<VanGoodsActionProps> = (props: ActiveVanGoodsActionProps) => {
  const safeAreaInsetBottom = props.safeAreaInsetBottom;

  const classnames = useMemoClassNames();

  return <View className={
    classnames(
      isExternalClass && "custom-class",
      isNormalClass && props.className,
      bem('goods-action', { safe: safeAreaInsetBottom })
    )
  }>
    {props.children}
  </View>
}

VanGoodsAction.defaultProps = {
  safeAreaInsetBottom: true
}

VanGoodsAction.externalClasses = [
  'custom-class'
]

export default VanGoodsAction
