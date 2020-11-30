import Taro from "@tarojs/taro";

import "./index.less";
import { Block } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanProgress from "src/components/vant-react/Progress";

export default function ProgressPage() {
  return (
    <Block>
      <DemoBlock title="基础用法">
        <VanProgress
          custom-class="progress-position"
          className="progress-position"
          percentage="50"
        />
      </DemoBlock>

      <DemoBlock title="线条粗细">
        <VanProgress
          custom-class="progress-position"
          className="progress-position"
          strokeWidth="8"
          percentage="50"
        />
      </DemoBlock>

      <DemoBlock title="置灰">
        <VanProgress
          custom-class="progress-position"
          className="progress-position"
          inactive
          percentage="50"
        />
      </DemoBlock>

      <DemoBlock title="样式定制">
        <VanProgress
          custom-class="progress-position"
          className="progress-position"
          pivotText="橙色"
          color="#f2826a"
          percentage="25"
        />
        <VanProgress
          custom-class="progress-position"
          className="progress-position"
          pivotText="红色"
          color="#ee0a24"
          percentage="50"
        />
        <VanProgress
          custom-class="progress-position"
          className="progress-position"
          percentage="75"
          pivotText="紫色"
          pivotColor="#7232dd"
          color="linear-gradient(to right, #be99ff, #7232dd)"
        />
      </DemoBlock>
    </Block>
  );
}

ProgressPage.options = {
  addGlobalClass: true
};

ProgressPage.config = {
  addGlobalClass: true
}
