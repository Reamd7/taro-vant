import Taro from "@tarojs/taro";

import "./index.less";
import { Block } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanNoticeBar from "src/components/vant-react/NoticeBar";

export default function NoticeBarPage() {
  const text = "在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。";
  const shortText = "技术是开发它的人的共同灵魂。";

  return (
    <Block>
      <DemoBlock title="基础用法">
        <VanNoticeBar text={text} leftIcon="volume-o" />
      </DemoBlock>

      <DemoBlock title="滚动模式">
        <VanNoticeBar
          scrollable
          text={shortText}
          custom-class="demo-margin-bottom"
          className="demo-margin-bottom"
        />
        <VanNoticeBar
          scrollable={false}
          text={text}
          custom-class="demo-margin-bottom"
          className="demo-margin-bottom"
        />
      </DemoBlock>

      <DemoBlock title="多行展示">
        <VanNoticeBar wrapable scrollable={false} text={text} />
      </DemoBlock>

      <DemoBlock title="通知栏模式">
        <VanNoticeBar mode="closeable" text={shortText} />
        <VanNoticeBar
          custom-class="margin-top"
          className="margin-top"
          mode="link"
          text={shortText}
        />
      </DemoBlock>

      <DemoBlock title="自定义样式">
        <VanNoticeBar
          text={shortText}
          color="#1989fa"
          background="#ecf9ff"
          leftIcon="info-o"
        ></VanNoticeBar>
      </DemoBlock>
    </Block>
  );
}
