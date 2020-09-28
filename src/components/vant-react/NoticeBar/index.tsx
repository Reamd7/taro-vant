import Taro, {
  useState,
  useRef,
  useScope,
  useEffect,
  useCallback
} from "@tarojs/taro";

import "./index.less";
import VanIcon, { VanIconProps } from "../icon";
import { View, Navigator } from "@tarojs/components";
import { ITouchEvent } from "@tarojs/components/types/common";
import {
  useMemoClassNames,
  useMemoBem,
  isWeapp,
  isH5,
  useMemoCssProperties,
  noop,
  getRect,
  requestAnimationFrame
} from "../common/utils";

export type VanNoticeBarProps = {
  mode?: "closeable" | "link";
  text?: string;
  url?: string;
  openType?: React.ComponentProps<typeof Navigator>["openType"];
  delay?: number;
  speed?: number;
  scrollable?: boolean;
  leftIcon?: VanIconProps["name"];
  color?: string;
  background?: string;
  wrapable?: boolean;

  onClick?: React.ComponentProps<typeof View>["onClick"];
  onClose?: React.ComponentProps<typeof VanIcon>["onClick"];

  renderLeftIcon?: React.ReactNode;
  renderRightIcon?: React.ReactNode;

  className?: string;
  ["custom-class"]?: string;
};

const VanNoticeBar: Taro.FunctionComponent<VanNoticeBarProps> = props => {
  const {
    mode = "",
    text = "",
    url = "",
    openType = "navigate",
    delay = 1,
    speed = 50,
    scrollable = true,
    leftIcon = "",
    color = "#ed6a0c",
    background = "#fffbe8",
    wrapable = false
  } = props;

  const [show, setShow] = useState(true);
  const scope = useScope();
  const [animationData, setanimationData] = useState<{
    actions: Record<string, any>[];
  }>();
  const self = useRef({
    props: {
      speed, scrollable, delay
    },
    wrapWidth: 0,
    contentWidth: 0,
    duration: 0,
    animation: null as null | Taro.Animation,
    timer: null as null | NodeJS.Timeout,
    resetAnimation: Taro.createAnimation({
      duration: 0,
      timingFunction: "linear"
    }) as Taro.Animation | null,

    init() {
      const ins = self.current;
      Promise.all([
        getRect(scope, ".van-notice-bar__content"),
        getRect(scope, ".van-notice-bar__wrap")
      ]).then((rects: WechatMiniprogram.BoundingClientRectCallbackResult[]) => {
        const [contentRect, wrapRect] = rects;
        if (
          contentRect == null ||
          wrapRect == null ||
          !contentRect.width ||
          !wrapRect.width
        ) {
          return;
        }

        const { speed, scrollable, delay } = ins.props;

        if (scrollable && wrapRect.width < contentRect.width) {
          const duration = (contentRect.width / speed) * 1000;

          ins.wrapWidth = wrapRect.width;
          ins.contentWidth = contentRect.width;
          ins.duration = duration;
          ins.animation = Taro.createAnimation({
            duration,
            timingFunction: "linear",
            delay
          });

          ins.scroll();
        }
      });
    },

    scroll() {
      const ins = self.current;

      ins.timer && clearTimeout(ins.timer);
      ins.timer = null;
      if (ins.resetAnimation && ins.animation) {
        setanimationData(
          ins.resetAnimation
            .translateX(ins.wrapWidth)
            .step()
            .export()
        );
        requestAnimationFrame(() => {
          if (ins.animation) {
            setanimationData(
              ins.animation
                .translateX(-ins.contentWidth)
                .step()
                .export()
            );
          }
        });
        ins.timer = setTimeout(() => {
          ins.scroll();
        }, ins.duration);
      } else {
        throw "Error in NoticeBar Scroll";
      }
    }
  });
  useEffect(() => {
    self.current.props = {
      speed, scrollable, delay
    };
  }, [
    speed, scrollable, delay
  ]);
  useEffect(() => {
    Taro.nextTick(() => {
      self.current.init();
    });
  }, [text, speed]);

  const onClickIcon = useCallback(
    (e: ITouchEvent) => {
      const ins = self.current;
      if (mode === "closeable") {
        ins.timer && clearTimeout(ins.timer);
        ins.timer = null;
        setShow(false);
        props.onClose && props.onClose(e);
      }
    },
    [props.onClose, mode]
  );

  const classnames = useMemoClassNames();
  const bem = useMemoBem();
  const css = useMemoCssProperties();

  return show ? (
    <View
      className={classnames(
        isWeapp && "custom-class",
        isH5 && props.className,
        bem("notice-bar", { withicon: mode, wrapable })
      )}
      style={css({
        color,
        background
      })}
      onClick={props.onClick || noop}
    >
      {leftIcon ? (
        <VanIcon
          size={16}
          name={leftIcon}
          className="van-notice-bar__left-icon"
          custom-class="van-notice-bar__left-icon"
        />
      ) : (
        props.renderLeftIcon
      )}
      <View className="van-notice-bar__wrap">
        <View
          className={classnames(
            "van-notice-bar__content",
            !scrollable && !wrapable ? "van-ellipsis" : ""
          )}
          animation={animationData}
        >
          {text}
        </View>
      </View>
      {mode === "closeable" ? (
        <VanIcon
          name="cross"
          className="van-notice-bar__right-icon"
          custom-class="van-notice-bar__right-icon"
          onClick={onClickIcon}
        />
      ) : mode === "link" ? (
        <Navigator url={url} openType={openType} />
      ) : (
        props.renderRightIcon
      )}
    </View>
  ) : null;
};

VanNoticeBar.options = {
  addGlobalClass: true
};

VanNoticeBar.externalClasses = ["custom-class"];

export default VanNoticeBar;
