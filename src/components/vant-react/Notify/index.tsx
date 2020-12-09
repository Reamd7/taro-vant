import Taro from "@tarojs/taro";
import { useEffect, useState, useRef } from '@tarojs/taro' /** api **/;
import VanTransition from "../Transition";
import {
  noop,
  useMemoCssProperties,
  useMemoAddUnit,
  getContext,
  getSystemInfoSync
} from "../common/utils";
import { View, Text } from "@tarojs/components";
import { VanNotifyMap, defaultOptions, NotifyProps } from "./common/utils";
import "./index.less";

const VanNotify: Taro.FunctionComponent<{}> = (props) => {
  const [statusBarHeight, setstatusBarHeight] = useState(0);
  useEffect(() => {
    setstatusBarHeight(getSystemInfoSync().statusBarHeight);
  }, []);
  const [data, setData] = useState<NotifyProps>(defaultOptions);

  const [isShow, setShow] = useState(false);
  const timer = useRef<number>();
  const hide = useRef(() => {
    const { onClose = noop } = data;
    clearTimeout(timer.current);
    setShow(false);
    Taro.nextTick(onClose);
  });
  const show = useRef(() => {
    const { duration = 3000, onOpened = noop } = data;
    clearTimeout(timer.current);
    setShow(true);
    Taro.nextTick(onOpened);
    if (duration > 0 && duration !== Infinity) {
      timer.current = (setTimeout(() => {
        hide.current();
      }, duration) as unknown) as number;
    }
  });

  useEffect(() => {
    let page = getContext();
    VanNotifyMap.set(page, {
      show,
      hide,
      setData
    });
    return () => {
      VanNotifyMap.delete(page);
    };
  }, []);

  const css = useMemoCssProperties();
  const addUnit = useMemoAddUnit();
  return (
    <VanTransition
      name="slide-down"
      show={isShow}
      className="van-notify__container"
      custom-class="van-notify__container"
      onClick={data.onClick}
      style={css({
        zIndex: data.zIndex,
        top: addUnit(data.top)
      })}
    >
      <View
        className={`van-notify van-notify--${data.type}`}
        style={css({
          background: data.background,
          color: data.color
        })}
      >
        {data.safeAreaInsetTop && (
          <View
            style={{
              height: statusBarHeight + "px"
            }}
          />
        )}
        <Text>{data.message}</Text>
      </View>
    </VanTransition>
  );
};

VanNotify.options={
  addGlobalClass: true
}

export default VanNotify;
