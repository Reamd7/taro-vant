import Taro from '@tarojs/taro';
const { useState, useCallback, useEffect } = Taro /** api **/;
import "./index.less";
import { Block, View } from '@tarojs/components';
import DemoBlock from '../components/demoBlock';
import VanSlider from 'src/components/vant-react/Slider';

export default function VanSilder() {

  const [cu2, setCu2] = useState(0);

  const [currentValue, setCurrentValue] = useState(50);

  const [disValue, setDisValue] = useState(currentValue);

  useEffect(() => {
    setDisValue(currentValue)
  }, [currentValue])

  const onChange = useCallback((v) => {
    Taro.showToast({
      icon: 'none',
      title: `当前值：${v}`
    })
    setCurrentValue(v)
  }, [])

  return <Block>
    <DemoBlock title="基础用法">
      <VanSlider
        defaultValue={currentValue}
        className="slider"
        custom-class="slider"
        onChange={onChange}
        // onDragStart={() => console.log("onDragStart")}
        // onDragEnd={() => console.log("onDragEnd")}
        // onDrag={(val) => console.log("onDrag" + val)}
      />
    </DemoBlock>

    <DemoBlock title="指定选择范围">
      <VanSlider
        className="slider"
        custom-class="slider"
        value={cu2}
        min={-50}
        max={50}
        onChange={setCu2}
      />
    </DemoBlock>

    <DemoBlock title="禁用">
      <VanSlider
        className="slider"
        custom-class="slider"
        value={currentValue}
        disabled
      />
    </DemoBlock>

    <DemoBlock title="指定步长">
      <VanSlider
        className="slider"
        custom-class="slider"
        value={currentValue}
        step={10}
        onChange={onChange}
      />
    </DemoBlock>



    <DemoBlock title="自定义按钮">
      <VanSlider
        value={currentValue}
        custom-class="slider"
        className="slider"
        useButtonSlot
        activeColor="#ee0a24"
        onDrag={setDisValue}
        onChange={onChange}
        renderButton={
          <View className="custom-button">
            {disValue}
          </View>
        }
      />
    </DemoBlock>

  </Block >
}

VanSilder.options = {
  addGlobalClass: true
}

VanSilder.config = {
  navigationBarTitleText: "Slider 滑块"
};
