import { WHITE } from "../../common/color";
import { noop, getContext } from 'taro-vant/utils';
import type VanTransition from "../../Transition";

export const VanNotifyMap = new Map<ReturnType<typeof getContext>, {
  show: Taro.MutableRefObject<() => void>;
  hide: Taro.MutableRefObject<() => void>;
  setData: Taro.Dispatch<Taro.SetStateAction<NotifyProps>>;
}>();
export const defaultOptions: NotifyProps = {
  message: "",
  background: "",
  type: "danger",
  color: WHITE,
  duration: 3000,
  zIndex: 110,
  top: 0,
  safeAreaInsetTop: false,
  onClick: noop,
  onOpened: noop,
  onClose: noop
  // selector: '#van-notify',
  // onClose: () => {},
};

export interface NotifyProps {
  message?: string;
  background?: string;
  type?: "primary" | "success" | "danger" | "warning";
  color?: string;
  duration?: number;
  zIndex?: number;
  top?: number;
  safeAreaInsetTop?: boolean;

  onClick?: React.ComponentProps<typeof VanTransition>["onClick"];

  // context?: any;
  // selector?: string;
  onOpened?: () => void;
  onClose?: () => void;
}
