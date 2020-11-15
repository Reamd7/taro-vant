import Taro, { useState } from "@tarojs/taro";

import "./index.less";
import { RED, GRAY } from "../common/color";
import VanPopup, { VanPopupProps } from "../Popup";
import { ActiveProps, useMemoClassNames, useMemoCssProperties, useMemoAddUnit, noop } from "../common/utils";
import VanGoodsActionButton, { VanGoodsActionButtonProps } from "../GoodsActionButton";
import bem from "../common/bem";
import { View, Text } from "@tarojs/components";
import VanGoodsAction from "../GoodsAction";
import VanButton from "../Button";
import { useCallback } from "react";
import useUpdateEffect from "src/common/hooks/useUpdateEffect";
import { useDialogOptions } from "./dialog";

export type VanDialogProps = {
  gid?: string;

  lang?: VanGoodsActionButtonProps['lang']
  title?: string;
  width?: string | number;
  message?: string;
  theme?: string;
  messageAlign?: string;
  zIndex?: number;
  className?: string;
  'custom-class'?: string;
  customStyle?: React.CSSProperties;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  overlay?: boolean;
  overlayStyle?: React.CSSProperties;
  closeOnClickOverlay?: boolean;

  useSlot?: boolean;
  children?: React.ReactNode

  useTitleSlot?: boolean;
  renderTitle?: React.ReactNode

  asyncClose?: boolean;
  transition?: VanPopupProps['transition'];

  // ==========================================
  confirmButtonOpenType?: VanGoodsActionButtonProps['openType'];
  sessionFrom?: VanGoodsActionButtonProps['sessionFrom'];
  sendMessageTitle?: VanGoodsActionButtonProps['sendMessageTitle'];
  sendMessageImg?: VanGoodsActionButtonProps['sendMessageImg'];
  sendMessagePath?: VanGoodsActionButtonProps['sendMessagePath'];
  showMessageCard?: VanGoodsActionButtonProps['showMessageCard'];
  appParameter?: VanGoodsActionButtonProps['appParameter'];
  onGetUserInfo?: VanGoodsActionButtonProps['onGetUserInfo'];
  onContact?: VanGoodsActionButtonProps['onContact'];
  onGetPhoneNumber?: VanGoodsActionButtonProps['onGetPhoneNumber'];
  onError?: VanGoodsActionButtonProps['onError'];
  onLaunchapp?: VanGoodsActionButtonProps['onLaunchapp'];
  onOpenSetting?: VanGoodsActionButtonProps['onOpenSetting'];

  show?: boolean;
  onClose?: () => (boolean | Promise<boolean>);
  onConfirm?: VoidFunction;
  onCancel?: VoidFunction;
  onOverlay?: VoidFunction;
};

const DefaultProps = {
  gid: "",
  width: 320,
  theme: "default",
  messageAlign: "center",
  zIndex: 2000,
  showConfirmButton: true,
  showCancelButton: false,
  confirmButtonText: "确认",
  cancelButtonText: "取消",
  confirmButtonColor: RED,
  cancelButtonColor: GRAY,
  overlay: true,
  closeOnClickOverlay: false,
  useSlot: false,
  useTitleSlot: false,
  asyncClose: false,
  transition: "scale",

  onConfirm: noop,
  onCancel: noop,
  onOverlay: noop
} as const




type ActiveVanDialogProps = ActiveProps<VanDialogProps, keyof typeof DefaultProps>
const VanDialog: Taro.FunctionComponent<VanDialogProps> = (props: ActiveVanDialogProps) => {
  const id = props.gid;

  const options = useDialogOptions(id)

  const {
    show: originalShow, theme, width,

    title, useTitleSlot, message, useSlot, messageAlign,

    showCancelButton, showConfirmButton
  } = {
    ...props,
    ...options
  };

  const [show, setShow] = useState(() => originalShow);


  const classnames = useMemoClassNames();
  const css = useMemoCssProperties();
  const addUnit = useMemoAddUnit();


  const [loading, setLoading] = useState({
    confirm: false,
    cancel: false,
  });
  useUpdateEffect(() => { setShow(originalShow) }, [originalShow]);
  useUpdateEffect(() => {
    !show && setLoading({
      confirm: false,
      cancel: false,
    })
  }, [show]);

  const onClose = useCallback(async (action: "confirm" | "cancel" | "overlay") => {
    switch (action) {
      case "confirm":
        props.onConfirm();
        break;
      case "cancel":
        props.onCancel();
        break;
      case "overlay":
        props.onOverlay();
        break;
    }
    if (props.onClose) {
      const res = await props.onClose()
      if (res) {
        setShow(false);
      }
    } else {
      setShow(false);
    }
  }, [props.onConfirm, props.onCancel, props.onOverlay]);

  const handleAction = useCallback((action: "confirm" | "cancel") => {
    setLoading((val) => ({
      ...val,
      [action]: true
    }))
    onClose(action)
  }, [onClose])

  const onConfirm = useCallback(() => {
    handleAction("confirm")
  }, [handleAction]);

  const onCancel = useCallback(() => {
    handleAction("cancel")
  }, [handleAction]);

  const onClickOverlay = useCallback(() => {
    onClose("overlay")
  }, [onClose]);


  return <VanPopup
    show={show}
    zIndex={props.zIndex}
    overlay={props.overlay}
    transition={props.transition}
    custom-class={classnames("van-dialog custom-class", "van-dialog--" + theme)}
    className={classnames("van-dialog", "van-dialog--" + theme, props.className)}
    customStyle={css({
      width: addUnit(width),
      ...props.customStyle
    })}
    overlayStyle={props.overlayStyle}
    closeOnClickOverlay={props.closeOnClickOverlay}
    onClose={onClickOverlay}
  >
    {(title || useTitleSlot) && (
      <View className={bem('dialog__header', { isolated: !(message || useSlot) })}>
        {useTitleSlot ? props.renderTitle : title}
      </View>
    )}
    {useSlot ? props.children :
      message ? <View
        className={bem('dialog__message', [theme, messageAlign, { hasTitle: title }])}
      >
        <Text className="van-dialog__message-text">{message}</Text>
      </View> : null
    }
    {theme === 'round-button' ?
      <VanGoodsAction
        className="van-dialog__footer--round-button"
        custom-class="van-dialog__footer--round-button">
        {showCancelButton && <View className="van-dialog__button van-hairline--right">
          <VanGoodsActionButton
            size="large"
            loading={loading.cancel}
            custom-class="van-dialog__cancel"
            // className="van-dialog__cancel" !!
            style={css({
              color: props.cancelButtonColor
            })}
            onClick={onCancel}
          >
            {props.cancelButtonText}
          </VanGoodsActionButton>
        </View>}
        {showConfirmButton && <View className="van-dialog__button">
          <VanGoodsActionButton
            size="large"
            loading={loading.confirm}
            custom-class="van-dialog__confirm"
            // className="van-dialog__confirm" !!
            style={css({
              color: props.confirmButtonColor
            })}
            openType={props.confirmButtonOpenType}
            lang={props.lang}
            // businessId={props.businessId}
            sessionFrom={props.sessionFrom}
            sendMessageTitle={props.sendMessageTitle}

            onClick={onConfirm}
            onGetUserInfo={props.onGetUserInfo}
            onContact={props.onContact}
            onGetPhoneNumber={props.onGetPhoneNumber}
            onError={props.onError}
            onLaunchapp={props.onLaunchapp}
            onOpenSetting={props.onOpenSetting}
          >
            {props.confirmButtonText}
          </VanGoodsActionButton>
        </View>}
      </VanGoodsAction> :
      <View className="van-hairline--top van-dialog__footer">
        {showCancelButton && <View className="van-dialog__button van-hairline--right">
          <VanButton
            size="large"
            loading={loading.cancel}
            custom-class="van-dialog__cancel"
            className="van-dialog__cancel"
            style={css({
              color: props.cancelButtonColor
            })}
            onClick={onCancel}
          >
            {props.cancelButtonText}
          </VanButton>
        </View>}
        {showConfirmButton && <View className="van-dialog__button">
          <VanButton
            size="large"
            loading={loading.confirm}
            custom-class="van-dialog__confirm"
            className="van-dialog__confirm"
            style={css({
              color: props.confirmButtonColor
            })}
            openType={props.confirmButtonOpenType}
            lang={props.lang}
            // businessId={props.businessId}
            sessionFrom={props.sessionFrom}
            sendMessageTitle={props.sendMessageTitle}

            onClick={onConfirm}
            onGetUserInfo={props.onGetUserInfo}
            onContact={props.onContact}
            onGetPhoneNumber={props.onGetPhoneNumber}
            onError={props.onError}
            onLaunchapp={props.onLaunchapp}
            onOpenSetting={props.onOpenSetting}
          >
            {props.confirmButtonText}
          </VanButton>
        </View>}
      </View>
    }
  </VanPopup>
}

VanDialog.options = {
  addGlobalClass: true
}

VanDialog.externalClasses = [
  'custom-class'
]

VanDialog.defaultProps = DefaultProps

export default VanDialog;
