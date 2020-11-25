import Taro, { useCallback } from "@tarojs/taro";
import { View, Button, Image } from "@tarojs/components";
import { useMemoBem } from "../common/utils";
import { ITouchEvent } from "@tarojs/components/types/common";
import "./options.less";

var PRESET_ICONS = ["qq", "weibo", "wechat", "link", "qrcode", "poster"];
function getIconURL(icon: string) {
  if (PRESET_ICONS.indexOf(icon) !== -1) {
    return "https://img.yzcdn.cn/vant/share-icon-" + icon + ".png";
  }
  return icon;
}

export type VanShareSheetOption = {
  openType?: React.ComponentProps<typeof Button>["openType"];
  icon: string;
  name?: string;
  description?: string;
};

const VanShareSheetOptions: Taro.FunctionComponent<{
  showBorder?: boolean;
  options: Array<VanShareSheetOption>;
  onSelect: (data: VanShareSheetOption & { index: number }) => unknown;
}> = props => {
  const { showBorder, options } = props;
  const bem = useMemoBem();
  const onSelect = useCallback(
    (event: ITouchEvent) => {
      const { index } = event.currentTarget.dataset;
      const option = options[index];
      props.onSelect({
        ...option,
        index
      });
    },
    [options]
  );
  return (
    <View className={bem("share-sheet__options", { border: showBorder })}>
      {options && options.map((item, index) => {
        return (
          <View
            key={item.name || index}
            data-index={index}
            className="van-share-sheet__option"
            onClick={onSelect}
          >
            <Button
              className="van-share-sheet__button"
              openType={item.openType}
            >
              <Image
                src={getIconURL(item.icon)}
                className="van-share-sheet__icon"
              />
            </Button>
            {item.name ? (
              <View className="van-share-sheet__name">{item.name}</View>
            ) : null}
            {item.description ? (
              <View className="van-share-sheet__option-description">
                {item.description}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
};

VanShareSheetOptions.options = {
  addGlobalClass: true
}

export default VanShareSheetOptions;
