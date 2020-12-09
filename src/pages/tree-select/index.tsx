import Taro from "@tarojs/taro";
const { useState } = Taro /** api **/;
import config from './config';
import { Block, View } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanTreeSelect from "src/components/vant-react/TreeSelect";
import VanImage from "src/components/vant-react/Image";

const items = [
  {
    text: config.pro1Name,
    children: config.pro1,
  },
  {
    text: config.pro2Name,
    children: config.pro2,
  },
  {
    text: config.pro3Name,
    disabled: true,
    children: config.pro3,
  },
];

const badgeItems = items.slice(0, 2).map((item, index) => {
  if (index === 0) {
    return { ...item, dot: true };
  }
  if (index === 1) {
    return { ...item, info: 5 };
  }

  return item;
})

export default function TreeSelectPage() {

  const [mainActiveIndex, setmainActiveIndex] = useState(1);

  return <Block>
    <DemoBlock title="单选模式">
      <VanTreeSelect
        pid="1"
        items={items}
        defaultactiveId={[]}
        defaultMainActiveIndex={0}
        max={1}
      />
    </DemoBlock>
    <DemoBlock title="多选模式">
      <VanTreeSelect
        pid="2"
        items={items}
        defaultactiveId={[]}
        defaultMainActiveIndex={1}
        max={2}
      />
    </DemoBlock>
    <DemoBlock title="徽标提示">
      <VanTreeSelect
        pid="3"
        items={badgeItems}
        defaultactiveId={[]}
        defaultMainActiveIndex={1}
      />
    </DemoBlock>
    <DemoBlock title="自定义内容">
      <VanTreeSelect
        pid="4"
        items={[{ text: '分组 1' }, { text: '分组 2' }]}
        mainActiveIndex={mainActiveIndex}
        onClickNav={setmainActiveIndex}
        renderContent={
          <View>
            {mainActiveIndex === 0 ? <VanImage
              src="https://img.yzcdn.cn/vant/apple-1.jpg"
              width="100%"
              height="100%"
              mode="widthFix"
            /> :
              mainActiveIndex === 1 ? <VanImage
                src="https://img.yzcdn.cn/vant/apple-2.jpg"
                width="100%"
                height="100%"
                mode="widthFix"
              /> : null}
          </View>

        }
      />
    </DemoBlock>
  </Block>
}

TreeSelectPage.config = {
  "navigationBarTitleText": "TreeSelect 分类选择"
}
