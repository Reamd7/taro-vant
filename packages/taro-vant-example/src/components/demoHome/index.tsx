import list from "./list";
import { View, Image } from "@tarojs/components";
import DemoHomeNav from "../demoHomeNav";
import "./index.less";

export default function Index() {
  return (
    <View className="demo-home">
      <View className="demo-home__title">
        <Image
          mode="aspectFit"
          className="demo-home__image"
          src="https://img.yzcdn.cn/vant/logo.png"
        />
        <View className="demo-home__text">Taro Vant Weapp</View>
      </View>
      <View className="demo-home__desc">使用Taro 重写 Vant Weapp 轻量、可靠的小程序 UI 组件库</View>
      {list.map((group) => <View key={group.groupName}>
          <DemoHomeNav group={group}/>
      </View>)}
    </View>
  );
}
