import Taro from "@tarojs/taro";
import "./index.less";
import { Block } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanLoading from "taro-vant/Loading";

export default function VanLoadingPage() {
  return <Block>
    <DemoBlock title="加载类型" padding>
      <VanLoading custom-class="demo-loading" className="demo-loading" />
      <VanLoading custom-class="demo-loading" className="demo-loading" type="spinner" />
    </DemoBlock>

    <DemoBlock title="自定义颜色" padding>
      <VanLoading custom-class="demo-loading" className="demo-loading" color="#1989fa" />
      <VanLoading custom-class="demo-loading" className="demo-loading" type="spinner" color="#1989fa" />
    </DemoBlock>

    <DemoBlock title="加载文案 +自定义大小" padding>
      <VanLoading custom-class="demo-loading" className="demo-loading" size={12}>加载中...</VanLoading>
    </DemoBlock>

    <DemoBlock title="垂直排列" padding>
      <VanLoading custom-class="demo-loading" className="demo-loading" size="240px" vertical>加载中...</VanLoading>
    </DemoBlock>
  </Block>

}
VanLoadingPage.options = {
  addGlobalClass: true
}
VanLoadingPage.config = {
  "navigationBarTitleText": "Loading 加载"
}
