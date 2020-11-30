import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.less";
import VanButton from "src/components/vant-react/Button";
import DemoBlock from "../components/demoBlock";
import VanEmpty from "src/components/vant-react/Empty";

export default function EmptyPage() {
  // const [activeTab, setactiveTab] = useState(0);

  return (
    <View>
      <DemoBlock title="基础用法" padding>
        <VanEmpty description="描述文字" />
      </DemoBlock>

      {/* <DemoBlock title="图片类型">
  <van-tabs
    active="{{ activeTab }}"
    bind:change="onChange"
  >
    <van-tab title="通用错误">
      <VanEmpty image="error" description="描述文字" />
    </van-tab>
    <van-tab title="网络错误">
      <VanEmpty image="network" description="描述文字" />
    </van-tab>
    <van-tab title="搜索提示">
      <VanEmpty image="search" description="描述文字" />
    </van-tab>
  </van-tabs>
</DemoBlock> */}
      <VanEmpty image="error" description="描述文字" />
      <VanEmpty image="network" description="描述文字" />
      <VanEmpty image="search" description="描述文字" />

      <DemoBlock title="自定义图片" padding>
        <VanEmpty
          custom-class="custom-image"
          className="custom-image"
          image="https://img.yzcdn.cn/vant/custom-empty-image.png"
          description="描述文字"
        />
      </DemoBlock>

      <DemoBlock title="底部内容" padding>
        <VanEmpty description="描述文字">
          <VanButton
            round
            type="danger"
            custom-class="bottom-button"
            className="bottom-button"
          >
            按钮
          </VanButton>
        </VanEmpty>
      </DemoBlock>
    </View>
  );
}

EmptyPage.config = {
  "navigationBarTitleText": "Empty 空状态"
}
EmptyPage.options = {
  addGlobalClass: true
}
