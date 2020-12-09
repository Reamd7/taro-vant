import Taro from "@tarojs/taro";
import { useState, useCallback } from "react"
import "./index.less";
import { RED, GRAY } from "../common/color";
import VanPopup, { VanPopupProps } from "../Popup";
import { ActiveProps, useMemoClassNames, useMemoCssProperties, useMemoAddUnit } from "../common/utils";
import VanGoodsActionButton, { VanGoodsActionButtonProps } from "../GoodsActionButton";
import bem from "../common/bem";
import { View, Text } from "@tarojs/components";
import VanGoodsAction from "../GoodsAction";
import VanButton from "../Button";
import useUpdateEffect from "src/common/hooks/useUpdateEffect";
import { useDialogOptions } from "./dialog";
import usePersistFn from "src/common/hooks/usePersistFn";

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
  onClose?: (action: "confirm" | "cancel" | "overlay") => (boolean | Promise<boolean>);
  onConfirm?: () => (boolean | Promise<boolean>);
  onCancel?: () => (boolean | Promise<boolean>);
  onOverlay?: () => (boolean | Promise<boolean>);
};
const booleanFunc = () => true;
const DefaultProps = {
  gid: "",
  lang: "zh_CN",
  title: "",
  width: 320,
  message: "",
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
  overlayStyle: undefined,
  closeOnClickOverlay: false,
  useSlot: false,
  useTitleSlot: false,
  asyncClose: false,
  transition: "scale",

  onClose: booleanFunc,
  onConfirm: booleanFunc,
  onCancel: booleanFunc,
  onOverlay: booleanFunc
} as const


type ActiveVanDialogProps = ActiveProps<VanDialogProps, keyof typeof DefaultProps>
const VanDialog: Taro.FunctionComponent<VanDialogProps> = (props: ActiveVanDialogProps) => {
  const id = props.gid;

  const [innerShow, setInnerShow] = useState(() => !!props.show);
  const [options] = useDialogOptions(id, setInnerShow)

  const {
    show: originalShow, theme, width,

    title, useTitleSlot, message, useSlot, messageAlign,

    showCancelButton, showConfirmButton,

    onClose: _onClose, onConfirm: _onConfirm, onCancel: _onCancel, onOverlay: _onOverlay
  } = {
    ...props,
    ...options
  };

  const show = originalShow || innerShow;

  const classnames = useMemoClassNames();
  const css = useMemoCssProperties();
  const addUnit = useMemoAddUnit();

  const [loading, setLoading] = useState({
    confirm: false,
    cancel: false,
  });
  // useUpdateEffect(() => { setInnerShow(!!originalShow) }, [originalShow]);
  useUpdateEffect(() => {
    !show && setLoading({
      confirm: false,
      cancel: false,
    })
  }, [show]);

  const onClose = usePersistFn(async (action: "confirm" | "cancel" | "overlay") => {
    switch (action) {
      case "confirm":
        const res1 = await  _onConfirm();
        if (!res1) return ;
        break;
      case "cancel":
        const res2 = await _onCancel();
        if (!res2) return ;

        break;
      case "overlay":
        const res3 = await _onOverlay();
        if (!res3) return ;
        break;
    }
    const res = await _onClose(action)
    if (!!res) {
      setInnerShow(false);
    }
    // if (_onClose) {
    //   const res = await _onClose()
    //   if (!!res) {
    //     setInnerShow(false);
    //   }
    // } else {
    //   setInnerShow(false);
    // }
  }, [_onConfirm, _onCancel, _onOverlay, _onClose]);

  const handleAction = useCallback((action: "confirm" | "cancel") => {
    setLoading((val) => ({
      ...val,
      [action]: true
    }))
    onClose(action)
  }, [onClose])

  const onConfirm = usePersistFn(() => {
    if (loading.confirm) return ;
    handleAction("confirm")
  }, [handleAction, loading]);

  const onCancel = usePersistFn(() => {
    if (loading.cancel) return ;

    handleAction("cancel")
  }, [handleAction, loading]);

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
    style={css({
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
            // size="large"
            size="normal"
            loading={loading.cancel}
            custom-class="van-dialog__cancel"
            // className="van-dialog__cancel" !!
            // style={css({
            //   color: props.cancelButtonColor
            // })}
            onClick={onCancel}
            isFirst={showCancelButton}
            isLast={!showConfirmButton}
            text={props.cancelButtonText}
            disabled={loading['cancel']}
          />
        </View>}
        {showConfirmButton && <View className="van-dialog__button">
          <VanGoodsActionButton
            // size="large"
            size="normal"
            loading={loading.confirm}
            custom-class="van-dialog__confirm"
            // className="van-dialog__confirm" !!
            // style={css({
            //   color: props.confirmButtonColor
            // })}
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
            isFirst={!showCancelButton}
            isLast={showConfirmButton}
            text={props.confirmButtonText}


            disabled={loading['confirm']}
          />
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
            disabled={loading['cancel']}

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
            disabled={loading['confirm']}
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
