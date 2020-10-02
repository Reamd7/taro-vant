import { View, Text } from '@tarojs/components';
import Taro, { useState } from '@tarojs/taro';
import VanRate from 'src/components/vant-react/Rate';
import DemoBlock from '../components/demoBlock';

import "./index.less";

export default function RatePage() {
  const [value1, setValue1] = useState(3)
  const [value2, setValue2] = useState(3)
  const [value3, setValue3] = useState(3)
  const [value4, setValue4] = useState(2.5)
  const [value5, setValue5] = useState(4)
  const [value6, setValue6] = useState(3)

  return <View>
    <DemoBlock title="基础用法">
      <VanRate
        className="rate-position"
        custom-class="rate-position"
        value={value1}
        onChange={setValue1}
      /><Text>{value1}</Text>
    </DemoBlock>

    <DemoBlock title="自定义图标">
      <VanRate
        className="rate-position"
        custom-class="rate-position"
        icon="like"
        voidIcon="like-o"
        value={value2}
        onChange={setValue2}

      /><Text>{value2}</Text>
    </DemoBlock>

    <DemoBlock title="自定义样式">
      <VanRate
        className="rate-position"
        custom-class="rate-position"
        value={value3}
        onChange={setValue3}
        size={25}
        color="#ee0a24"
        voidColor="#eee"
        voidIcon="star"
        touchable
      /><Text>{value3}</Text>
    </DemoBlock>

    <DemoBlock title="半星">
      <VanRate
        className="rate-position"
        custom-class="rate-position"
        value={value4}
        onChange={setValue4}
        size={25}
        allowHalf
        color="#ee0a24"
        voidColor="#eee"
        voidIcon="star"
        // touchable={false}
      /> <Text>{value4}</Text>
    </DemoBlock>

    <DemoBlock title="自定义数量">
      <VanRate
        className="rate-position"
        custom-class="rate-position"
        value={value5}
        onChange={setValue5}
        count={6}
      /><Text>{value5}</Text>
    </DemoBlock>

    <DemoBlock title="禁用状态">
      <VanRate
        className="rate-position"
        custom-class="rate-position"
        value={value6}
        onChange={setValue6}
        disabled
      /><Text>{value6}</Text>
    </DemoBlock>

    <DemoBlock title="只读状态">
      <VanRate
        className="rate-position"
        custom-class="rate-position"
        value={value6}
        onChange={setValue6}
        readonly
      />
    </DemoBlock>

  </View>
}

RatePage.options = {
  addGlobalClass: true
}
