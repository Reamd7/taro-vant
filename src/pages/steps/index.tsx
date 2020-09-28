import Taro, { useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanSteps from "src/components/vant-react/Steps";
import VanButton from "src/components/vant-react/Button";
import icons from "src/components/vant-react/icon/config";
import { Toast } from "src/components/vant-react/Toast/toast";
import VanToast from "src/components/vant-react/Toast";

const steps = [
  {
    text: "步骤一",
    desc: "描述信息"
  },
  {
    text: "步骤二",
    desc: "描述信息"
  },
  {
    text: "步骤三",
    desc: "描述信息"
  },
  {
    text: "步骤四",
    desc: "描述信息"
  }
];
const customIconSteps = steps.map((item, index) => ({
  ...item,
  inactiveIcon: icons.outline[index],
  activeIcon: icons.basic[index]
}));
export default function StepsPage() {
  let [active, setActive] = useState(1);

  return (
    <View>
      <DemoBlock title="基础用法">
        <VanSteps
          steps={steps}
          active={active}
          onClickStep={(index) => {
            Toast(`Index: ${index}`);
          }}
          custom-class="demo-margin-bottom"
        />

        <VanButton
          className="demo-margin-left"
          custom-class="demo-margin-left"
          onClick={() => {
            setActive(++active % 4);
          }}
        >
          下一步
        </VanButton>
      </DemoBlock>

      <DemoBlock title="自定义样式">
        <VanSteps
          steps={steps}
          active={active}
          active-icon="success"
          activeColor="#38f"
          inactive-icon="arrow"
        />
      </DemoBlock>

      <DemoBlock title="自定义图标">
        <VanSteps steps={customIconSteps} active={active} />
      </DemoBlock>

      <DemoBlock title="竖向步骤条">
        <VanSteps
          steps={steps}
          active={active}
          direction="vertical"
          activeColor="#ee0a24"
        />
      </DemoBlock>
      <VanToast />
    </View>
  );
}
