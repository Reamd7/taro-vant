import Taro, { useState, useRef } from "@tarojs/taro";

import { TimeData } from "src/components/vant-react/CountDown/utils";
import { Block, Text } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanCountDown, {
  VanCountDownIns
} from "src/components/vant-react/CountDown";
import "./index.less";
import { Toast } from "src/components/vant-react/Toast/toast";
import VanToast from "src/components/vant-react/Toast";
import VanGrid from "src/components/vant-react/Grid";
import VanGridItem from "src/components/vant-react/Grid/item";
export default function CountDownPage() {
  const time = 30 * 60 * 60 * 1000;
  const [timeData, setTimeData] = useState<TimeData>();
  const ref = useRef<VanCountDownIns>();
  return (
    <Block>
      <DemoBlock title="基础用法">
        <VanCountDown time={time} />
      </DemoBlock>
      <DemoBlock title="自定义格式">
        <VanCountDown time={time} format="DD 天 HH 时 mm 分 ss 秒" />
      </DemoBlock>
      <DemoBlock title="毫秒级渲染">
        <VanCountDown millisecond time={time} format="HH:mm:ss:SSS" />
      </DemoBlock>
      <DemoBlock title="自定义样式">
        <VanCountDown
          useSlot
          time={time}
          onChange={timeData => {
            setTimeData(timeData);
          }}
        >
          {timeData && (
            <Block>
              <Text className="item">{timeData.hours}</Text>
              <Text className="item">{timeData.minutes}</Text>
              <Text className="item">{timeData.seconds}</Text>
            </Block>
          )}
        </VanCountDown>
      </DemoBlock>
      <DemoBlock title="手动控制">
        <VanCountDown
          millisecond
          time={3000}
          autoStart={false}
          format="ss:SSS"
          onFinish={() => {
            Toast("倒计时结束");
          }}
          ins={(ins: VanCountDownIns) => {
            ref.current = ins;
          }}
        />
        <VanGrid clickable columnNum={3} gid="test">
          <VanGridItem
            text="开始"
            icon="play-circle-o"
            gid="test"
            index={0}
            onClick={() => {
              ref.current && ref.current.start();
            }}
          />
          <VanGridItem
            text="暂停"
            icon="pause-circle-o"
            gid="test"
            index={1}
            onClick={() => {
              ref.current && ref.current.pause();
            }}
          />
          <VanGridItem
            text="重置"
            icon="replay"
            gid="test"
            index={2}
            onClick={() => {
              ref.current && ref.current.reset();
            }}
          />
        </VanGrid>
      </DemoBlock>
      <VanToast />
    </Block>
  );
}

CountDownPage.options = {
  addGlobalClass: true
};
