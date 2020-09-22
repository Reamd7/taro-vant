import Taro, { useState } from "@tarojs/taro";
import { Block, View } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanButton from "src/components/vant-react/Button";
import VanOverlay from "src/components/vant-react/Overlay";
import "src/components/vant-react/Overlay/index.less";

import { noop } from "src/components/vant-react/common/utils";
import "./index.less";

export default function OverLayPage() {
  const [data, setData] = useState(false);
  const [embbed, setEmbbed] = useState(false);
  return (
    <Block>
      <DemoBlock title="基础用法" padding>
        <VanButton type="primary" onClick={() => setData(true)}>
          显示遮罩层
        </VanButton>
        <VanOverlay show={data} onClick={() => setData(false)} />
      </DemoBlock>
      <DemoBlock title="嵌入内容" padding>
        <VanButton type="primary" onClick={() => setEmbbed(true)}>
          嵌入内容
        </VanButton>
        <VanOverlay show={embbed} onClick={() => setEmbbed(false)}>
          <View className="wrapper">
            <View className="block" onClick={(e) => {
              e.stopPropagation()
            }} />
          </View>
        </VanOverlay>
      </DemoBlock>
    </Block>
  );
}
