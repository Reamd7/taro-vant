import Taro from "@tarojs/taro";
import { Block } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanNavBar from "src/components/vant-react/NavBar";
import VanIcon from "src/components/vant-react/icon";
import "./index.less"
export default function NavBarPpage() {
  return (
    <Block>
      <DemoBlock title="基础用法">
        <VanNavBar
          title="标题"
          right-text="按钮"
          left-arrow
          onClickLeft={() => {
            Taro.showToast({ title: "点击返回", icon: "none" });
          }}
          onClickRight={() => {
            Taro.showToast({ title: "点击按钮", icon: "none" });
          }}
        />
      </DemoBlock>

      <DemoBlock title="高级用法">
        <VanNavBar
          title="标题"
          leftText="返回"
          leftArrow
          renderRight={
            <VanIcon
              name="search"
              custom-class="icon"
              className="icon"
              size={18}
            />
          }
        ></VanNavBar>
      </DemoBlock>
    </Block>
  );
}

NavBarPpage.options = {
  addGlobalClass: true
}
NavBarPpage.config = {
  "navigationBarTitleText": "NavBar 导航栏"
}
