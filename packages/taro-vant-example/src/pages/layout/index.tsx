import Taro from "@tarojs/taro";
import DemoBlock from "../components/demoBlock";
import VanRow from "taro-vant/Layout/Row";
import VanCol from "taro-vant/Layout/Col";
import { Block } from "@tarojs/components";
import "./index.less"
const Layout: Taro.FunctionComponent<{}> = () => {
  return (
    <Block>
      <DemoBlock title="基础用法" padding>
        <VanRow>
          <VanCol span={8} classNames="dark" custom-class="dark">
            span: 8
          </VanCol>
          <VanCol span={8} classNames="light" custom-class="light">
            span: 8
          </VanCol>
          <VanCol span={8} classNames="dark" custom-class="dark">
            span: 8
          </VanCol>
        </VanRow>

        <VanRow>
          <VanCol span={4} classNames="dark" custom-class="dark">
            span: 4
          </VanCol>
          <VanCol span={10} offset={4} classNames="light" custom-class="light">
            offset: 4, span: 10
          </VanCol>
        </VanRow>

        <VanRow>
          <VanCol offset={12} span={12} classNames="dark" custom-class="dark">
            offset: 12, span: 12
          </VanCol>
        </VanRow>
      </DemoBlock>

      <DemoBlock title="在列元素之间增加间距" padding>
        <VanRow gutter={20}>
          <VanCol gutter={20} span={8} classNames="dark" custom-class="dark">
            span: 8
          </VanCol>
          <VanCol gutter={20} span={8} classNames="light" custom-class="light">
            span: 8
          </VanCol>
          <VanCol gutter={20} span={8} classNames="dark" custom-class="dark">
            span: 8
          </VanCol>
        </VanRow>
      </DemoBlock>
    </Block>
  );
};

Layout.config = {
  navigationBarTitleText: "Layout 布局",
};
Layout.options = {
  addGlobalClass: true
}
export default Layout;
