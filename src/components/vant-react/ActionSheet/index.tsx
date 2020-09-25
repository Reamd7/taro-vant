import Taro, { useCallback } from "@tarojs/taro";
import { MixinsButtonProps } from "../common/mixins/button";
import {
  MixinsOpenTypeProps,
  MixinsOpenTypeEvents
} from "../common/mixins/open-type";
import { Button, View, Block, Text } from "@tarojs/components";
import VanIcon from "../icon";
import VanPopup from "../Popup";
import {
  noop,
  useMemoClassNames,
  useMemoBem,
  useMemoCssProperties
} from "../common/utils";
import { ITouchEvent } from "@tarojs/components/types/common";
import VanLoading from "../loading";
import "./index.less";

type SourceButtonProps = React.ComponentProps<typeof Button>;
type ActionSheetProps = {
  show?: boolean;
  title?: string;
  cancelText?: string;
  description?: string;
  round?: boolean;
  zIndex?: number;
  actions?: Array<
    {
      name?: string;
      subname?: string;
      color?: string;
    } & Pick<
      SourceButtonProps,
      | "loading"
      | "disabled"
      | "className"
      | "openType"
      | "lang"
      | "sessionFrom"
      | "sendMessageTitle"
      | "sendMessagePath"
      | "sendMessageImg"
      | "showMessageCard"
      | "appParameter"
    >
  >;
  overlay?: boolean;
  closeOnClickOverlay?: boolean;
  closeOnClickAction?: boolean;
  safeAreaInsetBottom?: boolean;
};

const VanActionSheet: Taro.FunctionComponent<ActionSheetProps & {
  onSelect?: SourceButtonProps["onClick"];
  onClose?: React.ComponentProps<typeof VanIcon>["onClick"];
  onCancel?: React.ComponentProps<typeof View>["onClick"];
  onClickOverlay?: React.ComponentProps<typeof VanPopup>["onClose"];
} & MixinsButtonProps &
  MixinsOpenTypeProps &
  MixinsOpenTypeEvents> = props => {
  const onClickOverlay = useCallback(
    (e: ITouchEvent) => {
      props.onClickOverlay && props.onClickOverlay(e);
      props.onClose && props.onClose(e);
    },
    [props.onClose, props.onClickOverlay]
  );
  const classnames = useMemoClassNames();
  const bem = useMemoBem();
  const css = useMemoCssProperties();
  return (
    <VanPopup
      show={props.show}
      position="bottom"
      round={props.round}
      zIndex={props.zIndex}
      overlay={props.overlay}
      className="van-action-sheet"
      custom-class="van-action-sheet"
      safeAreaInsetBottom={props.safeAreaInsetBottom}
      closeOnClickOverlay={props.closeOnClickOverlay}
      onClose={onClickOverlay}
    >
      {props.title && (
        <View className="van-hairline--bottom van-action-sheet__header">
          {props.title}
          <VanIcon
            name="close"
            custom-class="van-action-sheet__close"
            onClick={props.onClose}
          />
        </View>
      )}
      {props.description && (
        <View className="van-action-sheet__description">
          {props.description}
        </View>
      )}
      {props.actions && props.actions.length && (
        <View>
          {/* button外包一层view，防止actions动态变化，导致渲染时button被打散 */}
          {props.actions.map((item, index) => (
            <Button
              key={item.name}
              openType={item.openType}
              style={css({
                color: item.color
              })}
              className={classnames(
                bem("action-sheet__item", {
                  disabled: item.disabled || item.loading
                }),
                "van-hairline--top",
                item.className
              )}
              hoverClass="van-action-sheet__item--hover"
              data-index={index}
              onClick={props.onSelect}
              onGetUserInfo={props.onGetUserInfo || noop}
              onContact={props.onContact || noop}
              onGetPhoneNumber={props.onGetPhoneNumber || noop}
              onError={props.onError || noop}
              onLaunchapp={props.onLaunchapp || noop}
              onOpenSetting={props.onOpenSetting || noop}
              lang={props.lang}
              sessionFrom={props.sessionFrom}
              sendMessageImg={props.sendMessageImg}
              sendMessagePath={props.sendMessagePath}
              sendMessageTitle={props.sendMessageTitle}
              showMessageCard={props.showMessageCard}
              appParameter={props.appParameter}
            >
              {item.loading ? (
                <VanLoading
                  custom-class="van-action-sheet__loading"
                  size="20px"
                  className="van-action-sheet__loading"
                />
              ) : (
                <Block>
                  {item.name}
                  {item.subname && (
                    <Text className="van-action-sheet__subname">
                      {item.subname}
                    </Text>
                  )}
                </Block>
              )}
            </Button>
          ))}
        </View>
      )}
      {props.children}
      {props.cancelText && (
        <View
          className="van-action-sheet__cancel"
          hoverClass="van-action-sheet__cancel--hover"
          hoverStayTime={70}
          onClick={props.onCancel}
        >
          {props.cancelText}
        </View>
      )}
    </VanPopup>
  );
};

VanActionSheet.options = {
  addGlobalClass: true
};

VanActionSheet.defaultProps = {
  round: true,
  zIndex: 100,
  actions: [],
  overlay: true,
  closeOnClickOverlay: true,
  closeOnClickAction: true,
  safeAreaInsetBottom: true,
  onSelect: noop,
  onClose: noop,
  onCancel: noop,
  onClickOverlay: noop
};

export default VanActionSheet;
