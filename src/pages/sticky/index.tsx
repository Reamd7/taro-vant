import Taro, { usePageScroll, useRef, useState } from "@tarojs/taro";
import "./index.less";
import { Block, View, ScrollView } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanSticky from "src/components/vant-react/Sticky";
import VanButton from "src/components/vant-react/Button";
import usePersistFn from "src/common/hooks/usePersistFn";
import { ITouchEvent } from "@tarojs/components/types/common";

export default function VanStickyPage() {
  usePageScroll(()=>{

  })
  const [data, setData] = useState({
    scrollTop: 0,
    offsetTop: 0,
  })

  const onScroll = usePersistFn((event: ITouchEvent) => {
    Taro.createSelectorQuery()
      .select('#scroller')
      .boundingClientRect((res) => {
        setData({
          scrollTop: event.detail.scrollTop,
          offsetTop: res.top,
        });
      })
      .exec();
  }, [])

  const container = useRef(() => wx.createSelectorQuery().select('#container'))
  return <Block>
    <DemoBlock title="基础用法">
      <VanSticky>
        <VanButton type="primary" style={{
          marginLeft: 30 + "rpx"
        }}>
          基础用法
        </VanButton>
      </VanSticky>
    </DemoBlock>
    <DemoBlock title="吸顶距离">
      <VanSticky offsetTop={100}>
        <VanButton type="info" style={{
          marginLeft: 230 + "rpx"
        }}>
          吸顶距离
        </VanButton>
      </VanSticky>
    </DemoBlock>
    <DemoBlock title="指定容器">
      <View id="container" style="height: 150px; background-color: #fff;">
        <VanSticky container={container.current}>
          <VanButton type="warning" style={{
            marginLeft: 430 + "rpx"
          }}>
            指定容器
          </VanButton>
        </VanSticky>
      </View>
    </DemoBlock>
    <DemoBlock title="嵌套在 ScrollView 内使用">
      <ScrollView
        onScroll={onScroll}
        scroll-y
        id="scroller"
        style="height: 200px; background-color: #fff;"
      >
        <View style="height: 400px; padding-top: 50px;">
          <VanSticky scrollTop={data.scrollTop} offsetTop={data.offsetTop}>
            <VanButton type="warning">
              嵌套在 ScrollView 内
            </VanButton>
          </VanSticky>
        </View>
      </ScrollView>
    </DemoBlock>
  </Block >
}

VanStickyPage.config = {
  "navigationBarTitleText": "Sticky 粘性布局"
}

VanStickyPage.options = {
  addGlobalClass: true
}
