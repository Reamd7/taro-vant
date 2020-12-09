import Taro from "@tarojs/taro";
import { useState } from "react";
import "./index.less";
import { Block, Image } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanTabbar from "src/components/vant-react/Tabbar";
import VanTabbarItem from "src/components/vant-react/Tabbar/item";

const VanTabbarPage: Taro.FunctionComponent<{}> = () => {

  const [active, setActive] = useState<number | string>(0);

  return <Block>
    <DemoBlock title="基础用法">
      <VanTabbar
        defaultValue={0}
        custom-class="tabbar-position"
        className="tabbar-position"
        safeAreaInsetBottom={false}
        pid="1"
      >
        <VanTabbarItem icon="home-o" pid="1" index={0} total={4}>标签</VanTabbarItem>
        <VanTabbarItem icon="search" pid="1" index={1} total={4}>标签</VanTabbarItem>
        <VanTabbarItem icon="friends-o" pid="1" index={2} total={4}>标签</VanTabbarItem>
        <VanTabbarItem icon="setting-o" pid="1" index={3} total={4}>标签</VanTabbarItem>
      </VanTabbar>
    </DemoBlock>
    <DemoBlock title="通过名称匹配">
      <VanTabbar
        defaultValue={"setting"}
        custom-class="tabbar-position"
        className="tabbar-position"
        safeAreaInsetBottom={false}
        pid="2"
      >
        <VanTabbarItem icon="home-o" pid="2" index={0} total={4} name="home">标签</VanTabbarItem>
        <VanTabbarItem icon="search" pid="2" index={1} total={4} name="search">标签</VanTabbarItem>
        <VanTabbarItem icon="friends-o" pid="2" index={2} total={4} name="friends">标签</VanTabbarItem>
        <VanTabbarItem icon="setting-o" pid="2" index={3} total={4} name="setting">标签</VanTabbarItem>
      </VanTabbar>
    </DemoBlock>
    <DemoBlock title="显示徽标">
      <VanTabbar
        defaultValue={"setting"}
        custom-class="tabbar-position"
        className="tabbar-position"
        safeAreaInsetBottom={false}
        pid="3"
      >
        <VanTabbarItem icon="home-o" pid="3" index={0} total={4} name="home">标签</VanTabbarItem>
        <VanTabbarItem icon="search" pid="3" index={1} total={4} name="search" dot>标签</VanTabbarItem>
        <VanTabbarItem icon="friends-o" pid="3" index={2} total={4} name="friends" info="5">标签</VanTabbarItem>
        <VanTabbarItem icon="setting-o" pid="3" index={3} total={4} name="setting" info="20">标签</VanTabbarItem>
      </VanTabbar>
    </DemoBlock>
    <DemoBlock title="自定义图标">
      <VanTabbar
        defaultValue={"setting"}
        custom-class="tabbar-position"
        className="tabbar-position"
        safeAreaInsetBottom={false}
        pid="4"
      >
        <VanTabbarItem pid="4" index={0} total={3} name="home"
          renderIcon={
            <Image
              src='https://img.yzcdn.cn/vant/user-inactive.png'
              mode="aspectFit"
              style="width: 30px; height: 18px;"
            />
          }
          renderActiveIcon={
            <Image
              src='https://img.yzcdn.cn/vant/user-active.png'
              mode="aspectFit"
              style="width: 30px; height: 18px;"
            />
          }
        >
          自定义
        </VanTabbarItem>
        <VanTabbarItem icon="search" pid="4" index={1} total={3} name="search" dot>标签</VanTabbarItem>
        <VanTabbarItem icon="setting-o" pid="4" index={2} total={3} name="setting" info="20">标签</VanTabbarItem>
      </VanTabbar>
    </DemoBlock>
    <DemoBlock title="自定义颜色">
      <VanTabbar
        defaultValue={0}
        custom-class="tabbar-position"
        className="tabbar-position"
        safeAreaInsetBottom={false}
        pid="5"
        activeColor="#07c160"
        inActiveColor="#000"
      >
        <VanTabbarItem icon="home-o" pid="5" index={0} total={4}>标签</VanTabbarItem>
        <VanTabbarItem icon="search" pid="5" index={1} total={4}>标签</VanTabbarItem>
        <VanTabbarItem icon="friends-o" pid="5" index={2} total={4}>标签</VanTabbarItem>
        <VanTabbarItem icon="setting-o" pid="5" index={3} total={4}>标签</VanTabbarItem>
      </VanTabbar>
    </DemoBlock>
    <DemoBlock title="切换标签事件 (受控组件)">
      <VanTabbar
        active={active}
        onChange={(v) => {
          console.log(v)
          setActive(v)
        }}
        custom-class="tabbar-position"
        className="tabbar-position"
        safeAreaInsetBottom={true}
        fixed={true}
        pid="10"
      >
        <VanTabbarItem icon="home-o" pid="10" index={0} total={4}>标签2</VanTabbarItem>
        <VanTabbarItem icon="search" pid="10" index={1} total={4}>标签2</VanTabbarItem>
        <VanTabbarItem icon="friends-o" pid="10" index={2} total={4}>标签2</VanTabbarItem>
        <VanTabbarItem icon="setting-o" pid="10" index={3} total={4}>标签2</VanTabbarItem>
      </VanTabbar>
    </DemoBlock>
  </Block>
}
VanTabbarPage.options = {
  addGlobalClass: true
}
VanTabbarPage.config = {
  "navigationBarTitleText": "Tabbar 标签栏"
}

export default VanTabbarPage;
