import Taro, { useCallback, useMemo } from "@tarojs/taro";
import {
  useMixinsTransition,
  MixinsTransitionProps,
  MixinsTransitionExternalClass
} from "../common/mixins/transition";
import {
  noop,
  useMemoClassNames,
  useMemoBem,
  useMemoCssProperties,
  isWeapp,
  isH5
} from "../common/utils";
import { Block, View } from "@tarojs/components";
import VanIcon from "../icon";
import VanOverlay from "../Overlay";
import "./index.less";
import { ITouchEvent } from "@tarojs/components/types/common";
export type VanPopupProps = {
  show?: boolean;
  zIndex?: number;
  overlay?: boolean;
  name?: "top" | "bottom" | "right" | "left" | "center";
  position?: "top" | "bottom" | "right" | "left" | "center";
  round?: boolean;
  customStyle?: React.CSSProperties;
  overlayStyle?: React.CSSProperties;
  closeOnClickOverlay?: boolean;
  closeable?: Boolean;
  closeIcon?: string;
  closeIconPosition?: string;
  safeAreaInsetBottom?: boolean;
  safeAreaInsetTop?: boolean;
  transition?: string;
  className?: string;
  ['custom-class']?: string;
  onClose?: React.ComponentProps<typeof VanIcon>['onClick'];
  onClickOverlay?: React.ComponentProps<typeof VanOverlay>['onClick'];

  noScroll?: boolean; // 这个开关一开就整个遮罩层都无法滚动了。
  closeIconClass?: string;
  ['close-icon-class']?: string;
} & MixinsTransitionProps
const VanPopup: Taro.FunctionComponent<VanPopupProps> = props => {
  const {
    transition,
    zIndex = 100,
    overlay = true,
    closeIcon = "cross",
    closeIconPosition = "top-right",
    closeOnClickOverlay = true,
    position = "center",
    safeAreaInsetBottom = true,
    safeAreaInsetTop = false,
    round,
    noScroll = false,
    onClose = noop,
    onClickOverlay = noop,
    duration: originDuration
  } = props;
  (props as any).name = position; // ?????
  const { data, onTransitionEnd } = useMixinsTransition(props, false);
  const _ClickOverlay = useCallback((e: ITouchEvent) => {
    onClickOverlay(e);
    if (closeOnClickOverlay) {
      onClose(e);
    }
  }, [closeOnClickOverlay, onClickOverlay, onClose]);
  const classNames = useMemoClassNames();
  const bem = useMemoBem();
  const css = useMemoCssProperties();
  const { currentDuration, display, classes, inited } = data;

  const {
    name, duration
  } = useMemo(() => {
    return {
      name: transition || position,
      duration: (
        transition === "none" ? 0 : originDuration
      )
    };
  }, [transition, position, originDuration])

  return (
    <Block>
      {overlay && (
        <VanOverlay
          show={props.show}
          zIndex={zIndex}
          style={props.overlayStyle}
          duration={duration}
          onClick={_ClickOverlay}
          noScroll={noScroll}
        />
      )}
      {inited && (
        <View
          className={classNames(
            isH5 && props.className,
            isWeapp && 'custom-class',
            classes,
            bem("popup", [
              position,
              { round, safe: safeAreaInsetBottom, safeTop: safeAreaInsetTop }
            ])
          )}
          style={css({
            zIndex: zIndex,
            transitionDuration: currentDuration + "ms",
            WebkitTransitionDuration: currentDuration + "ms",
            ...(display
              ? undefined
              : {
                display: "none"
              }),
            ...props.style
          })}
          onTransitionEnd={onTransitionEnd}
        >
          {props.children}
          {props.closeable && (
            <VanIcon
              name={closeIcon}
              className={
                classNames(
                  isH5 && props.closeIconClass,
                  isWeapp && "close-icon-class",
                  `van-popup__close-icon van-popup__close-icon--${closeIconPosition}`
                )
              }
              custom-class={
                classNames(
                  isH5 && props.closeIconClass,
                  isWeapp && "close-icon-class",
                  `van-popup__close-icon van-popup__close-icon--${closeIconPosition}`
                )
              }
              onClick={onClose}
            />
          )}
        </View>
      )}
    </Block>
  );
};
VanPopup.externalClasses = [
  'custom-class',
  'close-icon-class',
  ...MixinsTransitionExternalClass
]
VanPopup.options = {
  addGlobalClass: true
}
export default VanPopup;
