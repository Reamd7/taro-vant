import Taro from "@tarojs/taro";
import { useState } from "react";
import { Block } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanSwitch from "src/components/vant-react/Switch";


export default function SwitchPage() {
  const [checked, setChecked] = useState(true)
  return <Block>
    <DemoBlock title="基础用法" padding>
      <VanSwitch
        checked={checked}
        onChange={setChecked}
      />
    </DemoBlock>

    <DemoBlock title="禁用状态" padding>
      <VanSwitch
        checked={checked}
        disabled
        onChange={setChecked}
      />
    </DemoBlock>

    <DemoBlock title="加载状态" padding>
      <VanSwitch
        checked={checked}
        loading
        onChange={setChecked}
      />
    </DemoBlock>

    <DemoBlock title="自定义大小" padding>
      <VanSwitch
        checked={checked}
        size={24}
        onChange={setChecked}
      />
    </DemoBlock>

    <DemoBlock title="自定义颜色" padding>
      <VanSwitch
        checked={checked}
        activeColor="#07c160"
        inactiveColor="#ee0a24"
        onChange={setChecked}
      />
    </DemoBlock>

    {/* <DemoBlock title="异步控制" padding>
      <VanSwitch
        checked="{{ checked2 }}"
        size={36}

        onChange="onChange2"
      />
    </DemoBlock>

    <van-dialog id="van-dialog" /> */}

  </Block>
}

SwitchPage.options = {
  addGlobalClass: true,
}

SwitchPage.config = {
  navigationBarTitleText: "Switch 开关"
}
