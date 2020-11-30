import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanDivider from "src/components/vant-react/Divider";
import "./index.less";
export default function DivPage() {
  return (
    <View>
      <DemoBlock custom-class="white" className="white" title="基础用法" padding>
        <VanDivider />
      </DemoBlock>

      <DemoBlock custom-class="white" className="white" title="内容位置" padding>
        <VanDivider contentPosition="center">文本</VanDivider>
        <VanDivider contentPosition="left">文本</VanDivider>
        <VanDivider contentPosition="right">文本</VanDivider>
      </DemoBlock>

      <DemoBlock custom-class="white" className="white" title="虚线" padding>
        <VanDivider dashed />
      </DemoBlock>

      <DemoBlock custom-class="white" className="white" title="自定义样式" padding>
        <VanDivider
          contentPosition="center"
          textColor="#1989fa"
          borderColor="#1989fa"
          fontSize={18}
        >
          文本
        </VanDivider>
      </DemoBlock>
    </View>
  );
}

DivPage.options = {
  addGlobalClass: true
}
DivPage.config = {
  "navigationBarTitleText": "Divider 分割线"
}
