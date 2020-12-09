import Taro from "@tarojs/taro";
import { useMemo } from '@tarojs/taro' /** api **/;
import { View, Image } from "@tarojs/components";
import { useMemoClassNames, isExternalClass, isNormalClass } from "../common/utils";
import "./index.less";

export type VanEmptyProps = {
  image?: string;
  description?: string;

  renderDescription?: React.ReactNode;
  renderImage?: React.ReactNode;

  className?: string;
  "custom-class"?: string;
};
const PRESETS = ["error", "search", "default", "network"];

const VanEmpty: Taro.FunctionComponent<VanEmptyProps> = props => {
  const classnames = useMemoClassNames();
  const { image = "default" } = props;
  const imageUrl = useMemo(() => {
    if (PRESETS.indexOf(image) !== -1) {
      return `https://img.yzcdn.cn/vant/empty-image-${image}.png`;
    } else {
      return image;
    }
  }, [image]);
  return (
    <View
      className={classnames(
        isExternalClass && "custom-class",
        isNormalClass && props.className,
        "van-empty"
      )}
    >
      <View className="van-empty__image">{props.renderImage}</View>
      <View className="van-empty__image">
        {imageUrl && (
          <Image className="van-empty__image__img" src={imageUrl} />
        )}
      </View>
      <View className="van-empty__description">{props.renderDescription}</View>
      <View className="van-empty__description">{props.description}</View>
      <View className="van-empty__bottom">{props.children}</View>
    </View>
  );
};

VanEmpty.options = {
  addGlobalClass: true
};
VanEmpty.externalClasses = [
  'custom-class'
]
export default VanEmpty;
