import Taro from "@tarojs/taro";
import { View, Button, Block, ScrollView } from "@tarojs/components";
import VanPopup from "../Popup";
import VanShareSheetOptions, { VanShareSheetOption } from "./options";
import { noop } from "../common/utils";
import "./index.less";
const isMulti = (
  options: Array<VanShareSheetOption[]> | VanShareSheetOption[]
): options is Array<VanShareSheetOption[]> => {
  if (options == null || options[0] == null) {
    return false;
  }
  return !!(Array === options.constructor && Array === options[0].constructor);
};
type VanPopupProps = React.ComponentProps<typeof VanPopup>;
type VanShareSheetOptionsProps = React.ComponentProps<typeof VanShareSheetOptions>;
type VanShareSheetProps = {
  title?: string;
  cancelText?: string;
  description?: string;
  options: Array<VanShareSheetOption[]> | VanShareSheetOption[];
} & Pick<
  VanPopupProps,
  | "show"
  | "overlayStyle"
  | "zIndex"
  | "overlay"
  | "duration"
  | "safeAreaInsetBottom"
  | "closeOnClickOverlay"
  | "onClickOverlay"
  | "onClose"
> & {
    renderTitle?: React.ReactNode;
    renderDescription?: React.ReactNode;
  } & Pick<VanShareSheetOptionsProps, "onSelect"> & {
    onCancel?: VoidFunction;
  };
const VanShareSheet: Taro.FunctionComponent<VanShareSheetProps> = props => {
  const {
    show,
    overlay,
    duration,
    zIndex,
    overlayStyle,
    closeOnClickOverlay,
    safeAreaInsetBottom,
    onClose,
    onClickOverlay,
    title,
    description,
    cancelText,
    options
  } = props;
  // const ismulti = isMulti(props.options);

  return (
    <VanPopup
      round
      className="van-share-sheet"
      custom-class="van-share-sheet"
      show={show}
      position="bottom"
      overlay={overlay}
      duration={duration}
      zIndex={zIndex}
      overlayStyle={overlayStyle}
      closeOnClickOverlay={closeOnClickOverlay}
      safeAreaInsetBottom={safeAreaInsetBottom}
      onClose={onClose}
      onClickOverlay={onClickOverlay}
    >
      <View className="van-share-sheet__header">
        <View className="van-share-sheet__title">{props.renderTitle}</View>
        {title && <View className="van-share-sheet__title">{title}</View>}
        <View className="van-share-sheet__description">
          {props.renderDescription}
        </View>
        {description && (
          <View className="van-share-sheet__description">{description}</View>
        )}
      </View>
      <ScrollView scrollX={true}>
        {isMulti(options) ? (
          options.map((item, index) => {
            return (
              <VanShareSheetOptions
                showBorder={index !== 0}
                key={item[0].name || index}
                options={item}
                onSelect={props.onSelect}
              />
            );
          })
        ) : (
          <VanShareSheetOptions options={options} onSelect={props.onSelect} />
        )}
      </ScrollView>
      <Button
        type="default"
        className="van-share-sheet__cancel"
        onClick={e => {
          onClose && onClose(e);
          props.onCancel && props.onCancel();
        }}
      >
        {cancelText}
      </Button>
    </VanPopup>
  );
};
VanShareSheet.defaultProps = {
  zIndex: 100,
  cancelText: "取消",
  options: [],
  overlay: true,
  safeAreaInsetBottom: true,
  closeOnClickOverlay: true,
  onClickOverlay: noop,
  onClose: noop,
  onSelect: noop,
  onCancel: noop
} as VanShareSheetProps;
VanShareSheet.options = {
  addGlobalClass: true
};

export default VanShareSheet;
