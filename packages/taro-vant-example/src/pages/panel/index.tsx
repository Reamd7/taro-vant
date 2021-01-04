import Taro from "@tarojs/taro";

import "./index.less";
import { View } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanPanel from "taro-vant/Panel";
import VanButton from "taro-vant/Button";

export default function PanelPage() {
  return (
    <View>
      <DemoBlock title="基础用法">
        <VanPanel title="标题" desc="描述信息" status="状态">
          <View className="content">内容</View>
        </VanPanel>
      </DemoBlock>

      <DemoBlock title="高级用法">
        <VanPanel
          title="标题"
          desc="描述信息"
          status="状态"
          useFooterSlot
          renderFooter={
            <View className="footer">
              <VanButton size="small" className="demo-margin-right">
                按钮
              </VanButton>
              <VanButton size="small" type="danger">
                按钮
              </VanButton>
            </View>
          }
        >
          <View className="content">内容</View>
        </VanPanel>
      </DemoBlock>
    </View>
  );
}

PanelPage.options = {
  addGlobalClass: true
}

PanelPage.config = {
  "navigationBarTitleText": "Panel 面板"
}
