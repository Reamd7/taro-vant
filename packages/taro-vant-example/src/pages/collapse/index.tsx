import Taro from "@tarojs/taro";
const { useState } = Taro /** api **/;
import "./index.less";
import { Block, View, Text } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanCollapse from "taro-vant/Collapse/VanCollapse";
import VanCollapseItem from "taro-vant/Collapse/VanCollapseItem";
import VanIcon from "taro-vant/icon";

const d = {
  title1: '有赞微商城',
  title2: '有赞零售',
  title3: '有赞美业',
  content1: '提供多样店铺模板，快速搭建网上商城',
  content2:
    '网店吸粉获客、会员分层营销、一机多种收款，告别经营低效和客户流失',
  content3: '线上拓客，随时预约，贴心顺手的开单收银',
}

const VanCollapsePage: Taro.FunctionComponent<{}> = () => {
  const {
    title1,
    title2,
    title3,
    content1,
    content2,
    content3
  } = d
  const [active1, setActive1] = useState<(string | number)[]>([0])
  const [active2, setActive2] = useState<(string | number)[]>([1])

  return <Block>
    <DemoBlock title="基础用法 + 自定义标题内容">
      <VanCollapse pid="1" value={active1} onChange={setActive1}>
        <VanCollapseItem title={title1} pid="1" index={0} total={3}>{content1}</VanCollapseItem>
        <VanCollapseItem pid="1" index={1} total={3} renderTitle={
          <View style={{
            flex: 1,
            display: "flex"
          }}>
            <Text>{title2}</Text>
            <VanIcon name="question-o" custom-class="van-icon-question" className="van-icon-question" />
          </View>
        }>{content2}</VanCollapseItem>
        <VanCollapseItem title={title3} pid="1" index={2} total={3} value="内容" icon="shop-o">{content3}</VanCollapseItem>
      </VanCollapse>
    </DemoBlock>
    <DemoBlock title="手风琴 + 事件监听 + 禁用">
      <VanCollapse pid="2" value={active2} onChange={setActive2} accordion onOpen={(v) => console.log("onOpen", v)} onClose={(v) => console.log("onOpen", v)}>
        <VanCollapseItem title={title1} pid="2" index={0} total={3}>{content1}</VanCollapseItem>
        <VanCollapseItem title={title2} pid="2" index={1} total={3}>{content2}</VanCollapseItem>
        <VanCollapseItem title={title3} pid="2" index={2} total={3} disabled>{content3}</VanCollapseItem>
      </VanCollapse>
    </DemoBlock>
  </Block>
}

VanCollapsePage.options = {
  addGlobalClass: true
}
VanCollapsePage.config = {
  "navigationBarTitleText": "Collapse 折叠面板"
}
export default VanCollapsePage
