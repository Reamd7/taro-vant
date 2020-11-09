import Taro, { useState, useCallback, useMemo } from "@tarojs/taro";

import "./index.less";
import { Block } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanCircle from "src/components/vant-react/Circle";
import VanButton from "src/components/vant-react/Button";
const format = (rate: number) => Math.min(Math.max(rate, 0), 100);

export default function VanCirclePage() {
  const [value, setValue] = useState(25);

  const run = useCallback((step) => {
    setValue(
      format((value + step))
    )
  }, [value])

  return <Block>
    <DemoBlock>
      <VanCircle type="2d" value={value} text={value + "%"} />
    </DemoBlock>

    <DemoBlock title="样式定制">
      <VanCircle value={value} strokeWidth={6} text="宽度定制" />
      <VanCircle value={value} layerColor="#eee" color="#ee0a24" text="颜色定制" />
      <VanCircle value={value} color={{
        '0%': '#ffd01e',
        '50%': 'green',
        '100%': '#ee0a24'
      }} text={value + "%"}  />
      <VanCircle value={value} color="#07c160" clockwise={false} text="逆时针" />
      <VanCircle value={value} size={120} text="大小定制" />
    </DemoBlock>
    <VanButton type="primary" size="small" data-step={10} onClick={() => run(10)}>增加</VanButton>
    <VanButton type="danger" size="small" data-step={-10} onClick={() => run(-10)}>减少</VanButton>
  </Block>
}

VanCirclePage.config = {
  "navigationBarTitleText": "Circle 进度条"
}

VanCirclePage.options = {
  addGlobalClass: true
}
