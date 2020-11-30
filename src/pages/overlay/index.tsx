import Taro, { useState } from "@tarojs/taro";
import { View, ScrollView, Text } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanButton from "src/components/vant-react/Button";
import VanOverlay from "src/components/vant-react/Overlay";
import Longview from "./longview";
import "src/components/vant-react/Overlay/index.less";

import "./index.less";

const OverLayPage: Taro.FunctionComponent = () => {
  const [basic, setBasic] = useState(false);
  const [BasicEmbbed, setBasicEmbbed] = useState(false);
  // const [DisableScroll, setDisableScroll] = useState(false);
  const [
    DisableScrollPlusScrollView,
    setDisableScrollPlusScrollView
  ] = useState(false);

  // const [DisableScrollByStyle, setDisableScrollByStyle] = useState(false);

  return (
    <ScrollView
      scrollY
      style={{
        height: "100vh",
        // overflow: "auto"
      }}
    >
      <DemoBlock title="基础用法" padding>
        <VanButton type="primary" onClick={() => setBasic(true)}>
          显示遮罩层
        </VanButton>
        <VanOverlay show={basic} onClick={() => setBasic(false)} />
      </DemoBlock>
      <DemoBlock title="基础 嵌入内容 => children 使用 View 所以无法滚动" padding>
        <VanButton type="primary" onClick={() => setBasicEmbbed(true)}>
          嵌入内容
        </VanButton>
        <VanOverlay show={BasicEmbbed} onClick={() => setBasicEmbbed(false)}>
          <View className="wrapper">
            <View
              className="block"
              onClick={e => {
                e.stopPropagation();
              }}
            >
              <View>嵌入内容</View>
              <Longview />
            </View>
          </View>
        </VanOverlay>
      </DemoBlock>
      <DemoBlock title="禁止滚动 + ScrollView 嵌入内容 => children 使用ScrollView 进行滚动" padding>
        <VanButton type="primary" onClick={() => setDisableScrollPlusScrollView(true)}>
          ScrollView 嵌入内容
        </VanButton>
        <VanOverlay
          show={DisableScrollPlusScrollView}
          onClick={() => setDisableScrollPlusScrollView(false)}
        >
          <View className="wrapper">
            <ScrollView
              scrollY={true}
              className="block"
              onClick={e => {
                e.stopPropagation();
              }}
            >
              <View>禁止滚动 + ScrollView 嵌入内容</View>
              <View style={{
                color: "red"
              }}>
                我忍了一个报错，ScrollerView 滚动的时候(smooth)，touchmove遮罩层，会触发这个错误：
                [渲染层错误] Ignored attempt to cancel a touchmove event with cancelable=false, for example because scrolling is in progress and cannot be interrupted.
                <Text style={{
                  textDecoration: "line-through",
                  fontSize: "12px",
                  color: "#ccc"
                }}>两个滚动事件会导致这个问题,内层正在滚动的时候，外层也可以滚动</Text>
              </View>
              <Longview />
            </ScrollView>
          </View>
        </VanOverlay>
      </DemoBlock>
      {/* <DemoBlock title="基础 嵌入内容 + 外层使用 Style禁止元素滚动" padding>
        <VanButton type="primary" onClick={() => setDisableScrollByStyle(true)}>
          基础 嵌入内容 + 外层使用 Style禁止元素滚动
        </VanButton>
        <VanOverlay show={DisableScrollByStyle} onClick={() => setDisableScrollByStyle(false)}>
          <View className="wrapper">
            <View
              className="block"
              onClick={e => {
                e.stopPropagation();
              }}
            >
              <View>基础 嵌入内容 + 外层使用 Style禁止元素滚动</View>
              <View style={{
                color: "red"
              }}>
                问题就是失去了原来滚动的焦点。因为高度限制了，外层View重新渲染了。
              </View>
              <Longview />
            </View>
          </View>
        </VanOverlay>
      </DemoBlock> */}
      <Longview />
    </ScrollView>
  );
};
OverLayPage.options = {
  addGlobalClass: true
};
OverLayPage.config = {
  "navigationBarTitleText": "Overlay 遮罩层"
}

export default OverLayPage;
