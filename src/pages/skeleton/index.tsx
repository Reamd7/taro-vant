import Taro, { useState } from "@tarojs/taro";
import { View, Image, Switch } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanSkeleton from "../../components/vant-react/Skeleton";

import "./index.less";

export default function SkPage() {
  const [show, setShow] = useState(false);
  return (
    <View>
      <DemoBlock title="基础用法">
        <VanSkeleton title row={3} rowWidth={["100%", "100%", "80%"]} />
      </DemoBlock>

      <DemoBlock title="显示头像">
        <VanSkeleton title avatar row={3} />
      </DemoBlock>

      <DemoBlock title="展示子组件">
        <Switch
          checked={show}
          onChange={() => {
            setShow(!show);
          }}
          className="van-switch"
        />
        <VanSkeleton title avatar row={3} loading={!show}>
          <View className="demo-preview">
            <Image
              className="demo-preview-img"
              src="https://img.yzcdn.cn/vant/logo.png"
            />
            <View className="demo-content">
              <View className="demo-content-h3">关于 Vant Weapp</View>
              <View className="demo-content-p">
                Vant Weapp 是移动端 Vue 组件库 Vant 的小程序版本，两者基于相同的视觉规范，提供一致的 API 接口，助力开发者快速搭建小程序应用。
              </View>
            </View>
          </View>
        </VanSkeleton>
      </DemoBlock>
    </View>
  );
}

SkPage.options = {
  addGlobalClass: true
}
