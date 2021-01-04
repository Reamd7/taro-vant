import Taro from "@tarojs/taro";

import "./index.less";
import { Block, View } from "@tarojs/components";
import VanGrid from "taro-vant/Grid";
import VanGridItem from "taro-vant/Grid/item";
import VanSidebar from "taro-vant/Sidebar";
import VanSidebarItem from "taro-vant/Sidebar/item";
import VanNotify from "taro-vant/Notify";
import Notify from "taro-vant/Notify/common/notify";

const VanSiderPage: Taro.FunctionComponent<{}> = () => {
  return <Block>
    <VanGrid columnNum={2} border={false} gid="VanGrid-1">
      <VanGridItem useSlot gid="VanGrid-1" index={0} total={4}>
        <View className="demo-sidebar-title">基础用法</View>
        <VanSidebar className="custom-sidebar" custom-class="custom-sidebar" pid="VanSidebar-1">
          <VanSidebarItem title="标签名" pid="VanSidebar-1" index={0} total={3} />
          <VanSidebarItem title="标签名" pid="VanSidebar-1" index={1} total={3} />
          <VanSidebarItem title="标签名" pid="VanSidebar-1" index={2} total={3} />
        </VanSidebar>
      </VanGridItem>

      <VanGridItem useSlot gid="VanGrid-1" index={1} total={4}>
        <View className="demo-sidebar-title">徽标提示</View>
        <VanSidebar className="custom-sidebar" custom-class="custom-sidebar" pid="VanSidebar-2">
          <VanSidebarItem title="标签名" dot pid="VanSidebar-2" index={0} total={3} />
          <VanSidebarItem title="标签名" info="5" pid="VanSidebar-2" index={1} total={3} />
          <VanSidebarItem title="标签名" info="99+" pid="VanSidebar-2" index={2} total={3} />
        </VanSidebar>
      </VanGridItem>

      <VanGridItem useSlot gid="VanGrid-1" index={2} total={4}>
        <View className="demo-sidebar-title">禁用选项</View>
        <VanSidebar className="custom-sidebar" custom-class="custom-sidebar" pid="VanSidebar-3">
          <VanSidebarItem title="标签名" pid="VanSidebar-3" index={0} total={3} />
          <VanSidebarItem title="标签名" disabled pid="VanSidebar-3" index={1} total={3} />
          <VanSidebarItem title="标签名" pid="VanSidebar-3" index={0} total={3} />
        </VanSidebar>
      </VanGridItem>

      <VanGridItem useSlot gid="VanGrid-1" index={3} total={4}>
        <View className="demo-sidebar-title">监听切换事件</View>
        <VanSidebar className="custom-sidebar" custom-class="custom-sidebar" onChange={(v) => {
          Notify({
            type: 'primary',
            message: `切换至第${v}项`
          });
        }} pid="VanSidebar-4">
          <VanSidebarItem title="标签名 1" pid="VanSidebar-4" index={0} total={3} />
          <VanSidebarItem title="标签名 2" pid="VanSidebar-4" index={1} total={3} />
          <VanSidebarItem title="标签名 3" pid="VanSidebar-4" index={2} total={3} />
        </VanSidebar>
      </VanGridItem>
    </VanGrid>
    <VanNotify />
  </Block >
}

VanSiderPage.options = {
  addGlobalClass: true
}

VanSiderPage.config = {
  "navigationBarTitleText": "Sidebar 侧边导航"
}

export default VanSiderPage
