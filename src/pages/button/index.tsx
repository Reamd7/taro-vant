import Taro from "@tarojs/taro";
import DemoBlock from "../components/demoBlock";
import { View } from "@tarojs/components";
import VanButton from "taro-vant/Button";
import "./index.less";
const ButtonDemoPage: Taro.FunctionComponent = () => {
  return (
    <View>
      <DemoBlock title="按钮类型" padding>
        <View className="row">
          <VanButton
            className="demo-margin-right"
            custom-class="demo-margin-right"
            plain
          >
            默认按钮
          </VanButton>
          <VanButton
            type="primary"
            className="demo-margin-right"
            custom-class="demo-margin-right"
          >
            主要按钮
          </VanButton>
          <VanButton
            type="info"
            className="demo-margin-right"
            custom-class="demo-margin-right"
          >
            信息按钮
          </VanButton>
        </View>
        <VanButton
          type="danger"
          className="demo-margin-right"
          custom-class="demo-margin-right"
        >
          危险按钮
        </VanButton>
        <VanButton type="warning">警告按钮</VanButton>
      </DemoBlock>

      <DemoBlock title="朴素按钮" padding>
        <VanButton
          type="primary"
          plain
          className="demo-margin-right"
          custom-class="demo-margin-right"
        >
          朴素按钮
        </VanButton>
        <VanButton type="info" plain>
          朴素按钮
        </VanButton>
      </DemoBlock>

      <DemoBlock title="细边框" padding>
        <VanButton
          type="primary"
          plain
          hairline
          className="demo-margin-right"
          custom-class="demo-margin-right"
        >
          细边框按钮
        </VanButton>
        <VanButton type="info" plain hairline>
          细边框按钮
        </VanButton>
      </DemoBlock>

      <DemoBlock title="禁用状态" padding>
        <VanButton
          type="primary"
          disabled
          className="demo-margin-right"
          custom-class="demo-margin-right"
        >
          禁用状态
        </VanButton>
        <VanButton type="info" disabled>
          禁用状态
        </VanButton>
      </DemoBlock>

      <DemoBlock title="加载状态" padding>
        <VanButton
          loading
          type="primary"
          className="demo-margin-right"
          custom-class="demo-margin-right"
        />
        <VanButton
          loading
          type="primary"
          loading-type="spinner"
          className="demo-margin-right"
          custom-class="demo-margin-right"
        />
        <VanButton loading type="info" loadingText="加载中..." />
      </DemoBlock>

      <DemoBlock title="按钮形状" padding>
        <VanButton
          type="primary"
          square
          className="demo-margin-right"
          custom-class="demo-margin-right"
        >
          方形按钮
        </VanButton>
        <VanButton type="info" round>
          圆形按钮
        </VanButton>
      </DemoBlock>

      <DemoBlock title="图标按钮" padding>
        <VanButton
          type="primary"
          icon="star-o"
          className="demo-margin-right"
          custom-class="demo-margin-right"
        />
        <VanButton
          type="primary"
          icon="star-o"
          className="demo-margin-right"
          custom-class="demo-margin-right"
        >
          按钮
        </VanButton>
        <VanButton
          plain
          type="primary"
          icon="https://img.yzcdn.cn/vant/logo.png"
        >
          按钮
        </VanButton>
      </DemoBlock>

      <DemoBlock title="按钮尺寸" padding>
        <VanButton
          type="primary"
          size="large"
          block
          className="demo-margin-bottom"
          custom-class="demo-margin-bottom"
        >
          大号按钮
        </VanButton>
        <VanButton
          type="primary"
          className="demo-margin-right"
          custom-class="demo-margin-right"
        >
          普通按钮
        </VanButton>
        <VanButton
          type="primary"
          size="small"
          className="demo-margin-right"
          custom-class="demo-margin-right"
        >
          小型按钮
        </VanButton>
        <VanButton type="primary" size="mini">
          迷你按钮
        </VanButton>
      </DemoBlock>

      <DemoBlock title="块级元素" padding>
        <VanButton
          type="primary"
          className="demo-margin-bottom"
          custom-class="demo-margin-bottom"
        >
          普通按钮
        </VanButton>
        <VanButton type="primary" block>
          块级元素
        </VanButton>
      </DemoBlock>

      <DemoBlock title="自定义颜色" padding>
        <VanButton
          color="#7232dd"
          className="demo-margin-right"
          custom-class="demo-margin-right"
        >
          单色按钮
        </VanButton>
        <VanButton
          color="#7232dd"
          className="demo-margin-right"
          custom-class="demo-margin-right"
          plain
        >
          单色按钮
        </VanButton>
        <VanButton color="linear-gradient(to right, #4bb0ff, #6149f6)">
          渐变色按钮
        </VanButton>
      </DemoBlock>
    </View>
  );
};
ButtonDemoPage.options = {
  addGlobalClass: true
};
ButtonDemoPage.config = {
  navigationBarTitleText: "Button 按钮"
};
export default ButtonDemoPage;
