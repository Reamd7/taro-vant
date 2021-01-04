import Taro from "@tarojs/taro";
const { useRef, useState, useEffect } = Taro /** api **/;
import { isSameSecond, parseFormat, parseTimeData, TimeData } from "./utils";
import "./index.less";
import { View } from "@tarojs/components";
function simpleTick(fn: Function) {
  return setTimeout(fn, 30);
}
export type VanCountDownIns = {
  start: VoidFunction;
  pause: VoidFunction;
  reset: VoidFunction;
}
export type VanCountDownProps = {
  useSlot?: boolean;
  millisecond?: boolean;
  time?: number;
  format?: string;
  autoStart?: boolean;

  onFinish?: VoidFunction;
  onChange?: (timeData: TimeData) => void;
  ins?: (data: VanCountDownIns) => void;
};

const VanCountDown: Taro.FunctionComponent<VanCountDownProps> = props => {
  const {
    useSlot = false,
    millisecond = false,
    time,
    format = "HH:mm:ss",
    autoStart = true,
    onFinish,
    onChange
  } = props;
  const [formattedTime, setformattedTime] = useState("0");
  const self: React.MutableRefObject<{
    props: VanCountDownProps;
    timeData: TimeData;
    counting: boolean;
    tid: null | number;
    endTime: number;
    remain: number;

    getRemain: () => number;
    setRemain: (remain: number) => void;
    start: VoidFunction;
    pause: VoidFunction;
    reset: VoidFunction;
    tick: VoidFunction;
    microTick: VoidFunction;
    macroTick: VoidFunction;
  }> = useRef({
    props: {
      useSlot,
      millisecond,
      time,
      format,
      autoStart,
      onFinish,
      onChange
    },
    timeData: parseTimeData(0),
    counting: false,
    tid: null,
    endTime: 0,
    remain: 0,

    getRemain() {
      return Math.max(self.current.endTime - Date.now(), 0);
    },
    setRemain: (remain: number) => {
      const Ins = self.current;

      Ins.remain = remain;
      const timeData = parseTimeData(remain);

      if (Ins.props.useSlot) {
        Ins.props.onChange && Ins.props.onChange(timeData);
      }

      setformattedTime(parseFormat(Ins.props.format || "HH:mm:ss", timeData));

      if (remain === 0) {
        Ins.props.onFinish && Ins.props.onFinish();
      }
    },
    start: () => {
      const Ins = self.current;
      if (Ins.counting) {
        return;
      }

      Ins.counting = true;
      Ins.endTime = Date.now() + Ins.remain;
      Ins.tick();
    },
    pause() {
      const Ins = self.current;
      Ins.counting = false;
      if (Ins.tid !== null) {
        clearTimeout(Ins.tid);
      }
    },
    reset() {
      const Ins = self.current;
      Ins.pause();
      Ins.remain = Ins.props.time || 0;
      Ins.setRemain(Ins.remain);

      if (Ins.props.autoStart) {
        Ins.start();
      }
    },
    tick() {
      const Ins = self.current;
      if (Ins.props.millisecond) {
        Ins.microTick();
      } else {
        Ins.macroTick();
      }
    },
    microTick() {
      const Ins = self.current;

      Ins.tid = simpleTick(() => {
        Ins.setRemain(Ins.getRemain());

        if (this.remain !== 0) {
          Ins.microTick();
        }
      });
    },
    macroTick() {
      const Ins = self.current;

      Ins.tid = simpleTick(() => {
        const remain = Ins.getRemain();

        if (!isSameSecond(remain, Ins.remain) || remain === 0) {
          Ins.setRemain(remain);
        }

        if (Ins.remain !== 0) {
          Ins.macroTick();
        }
      });
    }
  });
  self.current.props = {
    useSlot,
    millisecond,
    time,
    format,
    autoStart,
    onFinish,
    onChange
  }

  useEffect(() => {
    if (props.ins) {
      props.ins({
        start: self.current.start,
        pause: self.current.pause,
        reset: self.current.reset
      });
    }
  }, [props.ins]);

  useEffect(()=>{
    self.current.reset()
  }, [time])

  return (
    <View className="van-count-down">
      {props.useSlot ? props.children : formattedTime}
    </View>
  );
};
VanCountDown.options = {
  addGlobalClass: true
};
export default VanCountDown;
