import Taro, { usePageScroll } from '@tarojs/taro';
import "./index.less";
import { Block, View } from '@tarojs/components';
import VanTab from 'src/components/vant-react/Tab';
import VanTabItem from 'src/components/vant-react/Tab/item';
import DemoBlock from '../components/demoBlock';
import { noop, isH5 } from 'src/components/vant-react/common/utils';
import VanIcon from 'src/components/vant-react/icon';
const data = {
  tabs2: [1, 2],
  tabs3: [1, 2, 3],
  tabs4: [1, 2, 3, 4],
  tabs6: [1, 2, 3, 4, 5, 6],
  tabsWithName: [
    { name: 'a', index: 1 },
    { name: 'b', index: 2 },
    { name: 'c', index: 3 }
  ]
}
const VanTabPage: Taro.FunctionComponent<{}> = () => {
  usePageScroll(noop)

  return <Block>
    <DemoBlock title="基础用法">
      <VanTab defaultActive={1} pid={"vantab_1"}>
        {data.tabs4.map((item, index) => {
          return <VanTabItem pid={"vantab_1"} key={item} total={data.tabs4.length} index={index} title={'标签 ' + item}>
            <View className="content">
              {'内容' + item}
            </View>
          </VanTabItem>
        })}
      </VanTab>
    </DemoBlock>
    <DemoBlock title="通过名称匹配">
      <VanTab active={"c"} pid={"vantab_2"}>
        {data.tabsWithName.map((item, index) => {
          return <VanTabItem
            pid={"vantab_2"}
            key={item.index}
            total={data.tabsWithName.length}
            index={index}
            title={'标签 ' + item.index}
            name={item.name}
          >
            <View className="content">
              {'内容' + item.name}
            </View>
          </VanTabItem>
        })}
      </VanTab>
    </DemoBlock>

    <DemoBlock title="粘性布局">
      <VanTab pid={"vantab_y"} sticky={true} offsetTop={100} >
        {data.tabs4.map((item, index) => {
          return <VanTabItem
            pid={"vantab_y"}
            key={item}
            total={data.tabs4.length}
            index={index}
            title={'标签 ' + item}
          >
            <View className="content">
              {'内容' + item}
            </View>
          </VanTabItem>
        })}
      </VanTab>
    </DemoBlock>

    <DemoBlock title="横向滚动">
      <VanTab pid={"vantab_3"}>
        {data.tabs6.map((item, index) => {
          return <VanTabItem
            pid={"vantab_3"}
            key={item}
            total={data.tabs6.length}
            index={index}
            title={'标签 ' + item}
          >
            <View className="content">
              {'内容' + item}
            </View>
          </VanTabItem>
        })}
      </VanTab>
    </DemoBlock>

    <DemoBlock title="禁用标签">
      <VanTab pid={"vantab_4"} onDisabled={(data) => {
        Taro.showToast({
          title: `标签 ${data.index + 1} 已被禁用`,
          icon: 'none'
        });
      }}>
        {data.tabs3.map((item, index) => {
          return <VanTabItem
            pid={"vantab_4"}
            key={item}
            total={data.tabs3.length}
            index={index}
            title={'标签 ' + item}
            disabled={index === 1}
          >
            <View className="content">
              {'内容' + item}
            </View>
          </VanTabItem>
        })}
      </VanTab>
    </DemoBlock>
    <DemoBlock title="样式风格">
      <VanTab pid={"vantab_5"}
        type="card" tab-class="special-tab" tabClass="special-tab">
        {data.tabs3.map((item, index) => {
          return <VanTabItem
            pid={"vantab_5"}
            key={item}
            total={data.tabs3.length}
            index={index}
            title={'标签 ' + item}
          >
            <View className="content-2">
              {'内容' + item}
            </View>
          </VanTabItem>
        })}
      </VanTab>
    </DemoBlock>
    <DemoBlock title="点击事件">
      <VanTab pid={"vantab_6"} onClick={(data) => {
        Taro.showToast({
          title: `点击标签 ${data.index + 1}`,
          icon: 'none'
        });
      }}>
        {data.tabs2.map((item, index) => {
          return <VanTabItem
            pid={"vantab_6"}
            key={item}
            total={data.tabs2.length}
            index={index}
            title={'标签 ' + item}
          >
            <View className="content">
              {'内容' + item}
            </View>
          </VanTabItem>
        })}
      </VanTab>
    </DemoBlock>

    <DemoBlock title="切换动画">
      <VanTab pid={"vantab_animated"} animated>
        {data.tabs4.map((item, index) => {
          return <VanTabItem
            pid={"vantab_animated"}
            key={item}
            total={data.tabs4.length}
            index={index}
            title={'标签 ' + item}
          >
            <View className="content">
              {'内容' + item}
            </View>
          </VanTabItem>
        })}
      </VanTab>
    </DemoBlock>
    <DemoBlock title="滑动切换">
      <VanTab pid={"swipeable"} swipeable>
        {data.tabs4.map((item, index) => {
          return <VanTabItem
            pid={"swipeable"}
            key={item}
            total={data.tabs4.length}
            index={index}
            title={'标签 ' + item}
          >
            <View className="content">
              {'内容' + item}
            </View>
          </VanTabItem>
        })}
      </VanTab>
    </DemoBlock>
    <DemoBlock title="自定义标题">
      <VanTab pid={"自定义标题"} swipeable defaultActive={1}
        onChange={(d) => {
          Taro.showToast({
            title: `切换到标签 ${d.index + 1}`,
            icon: 'none'
          });
        }}
        tabClass="special-tab"
        tab-class="special-tab"
        tab-active-class="special-tab-active"
        tabActiveClass="special-tab-active"
        renderNavRight={
          <VanIcon
            name="search"
            custom-class="right-nav"
            className="right-nav"
            onClick={() => {
              Taro.showToast({
                title: '点击 right nav',
                icon: 'none'
              });
            }}
          />
        }
      >
        {data.tabs4.map((item, index) => {
          return <VanTabItem
            pid={"自定义标题"}
            key={item}
            total={data.tabs4.length}
            index={index}
            title={'标签 ' + item}
            dot={index % 2 !== 0}
            info={index === 2 ? 99 : undefined}
          >
            <View className="content">
              {'内容' + item}
            </View>
          </VanTabItem>
        })}
      </VanTab>
    </DemoBlock>

    {isH5 ?
      <DemoBlock title="H5 swiper tab">
        <VanTab pid={"自定义标题2"} swipeable defaultActive={1} useSwiper tabs={data.tabs4.map((v, index) => ({
          index,
          title: "标题" + v
        }))}>
          <View>
            1
          </View>
          <View>
            2
          </View>
          <View>
            3
          </View>
          <View>
            4
          </View>
        </VanTab>
      </DemoBlock> :
      <DemoBlock title="Weapp swiper tab">
        <VanTab pid={"自定义标题2"} swipeable defaultActive={1} useSwiper tabs={data.tabs4.map((v, index) => ({
          index,
          title: "标题" + v
        }))}>
          <view slot="tab-0">
            1
          </view>
          <view slot="tab-1">
            2
          </view>
          <view slot="tab-2">
            3
          </view>
          <view slot="tab-3">
            4
          </view>
        </VanTab>
      </DemoBlock>
    }
  </Block>
}

VanTabPage.options = {
  addGlobalClass: true
}
VanTabPage.config = {
  "navigationBarTitleText": "Tab 标签页"
}


export default VanTabPage
