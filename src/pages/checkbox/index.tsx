import { Block, Image, View } from '@tarojs/components';
import Taro, { useState } from '@tarojs/taro';
import VanCell from 'src/components/vant-react/Cell';
import VanCellGroup from 'src/components/vant-react/CellGroup';
import VanCheckBox from 'src/components/vant-react/Checkbox';
import VanCheckBoxGroup from 'src/components/vant-react/Checkbox/group';
import DemoBlock from '../components/demoBlock';

import "./index.less";

export function CheckBoxPage() {
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(true);
  const [checkboxShape, setcheckboxShape] = useState(true);
  const [checkboxRed, setcheckboxRed] = useState<string[]>(['a', 'b']);
  const [checkboxRed2, setcheckboxRed2] = useState<string[]>([]);

  const [checkboxRed3, setcheckboxRed3] = useState<string[]>(['a']);

  const [checkboxRed4, setcheckboxRed4] = useState<string[]>(['a']);

  return <Block>
    <DemoBlock title="基本用法">
      <VanCheckBox
        custom-class="demo-checkbox"
        className="demo-checkbox"
        data-key="checkbox1"
        value={checkbox1}
        onChange={setCheckbox1}
      >
        复选框
      </VanCheckBox>
    </DemoBlock>
    <DemoBlock title="禁用状态">
      <VanCheckBox disabled value={false} custom-class="demo-checkbox"
        className="demo-checkbox">复选框</VanCheckBox>
      <VanCheckBox disabled value={true} custom-class="demo-checkbox"
        className="demo-checkbox">复选框</VanCheckBox>
    </DemoBlock>
    <DemoBlock title="自定义形状">
      <VanCheckBox
        custom-class="demo-checkbox"
        className="demo-checkbox"
        data-key="checkboxShape"
        shape="square"
        value={checkboxShape}
        onChange={setcheckboxShape}
      >
        复选框
      </VanCheckBox>
    </DemoBlock>
    <DemoBlock title="自定义颜色">
      <VanCheckBox
        custom-class="demo-checkbox"
        className="demo-checkbox"
        data-key="checkbox2"
        checkedColor="#07c160"
        value={checkbox2}
        onChange={setCheckbox2}
      >
        复选框
      </VanCheckBox>
    </DemoBlock>
    <DemoBlock title="自定义大小">
      <VanCheckBox
        custom-class="demo-checkbox"
        className="demo-checkbox"
        data-key="checkboxSize"
        checkedColor="#07c160"
        iconSize={25}
        value={checkbox2}
        onChange={setCheckbox2}
      >
        复选框
      </VanCheckBox>
    </DemoBlock>
    <DemoBlock title="自定义大小">
      <VanCheckBox
        useIconSlot
        custom-class="demo-checkbox"
        className="demo-checkbox"
        data-key="checkboxSize"
        value={checkbox2}
        onChange={setCheckbox2}
        renderIcon={
          <Image className="icon" mode="widthFix" src={checkbox2 ? 'https://img.yzcdn.cn/vant/user-active.png' : 'https://img.yzcdn.cn/vant/user-inactive.png'} />
        }
      >
        自定义图标
      </VanCheckBox>
    </DemoBlock>
    <DemoBlock title="禁用文本点击">
      <VanCheckBox
        custom-class="demo-checkbox"
        className="demo-checkbox"
        value={checkbox2}
        onChange={setCheckbox2}
        labelDisabled
      >
        复选框
      </VanCheckBox>
    </DemoBlock>
    <DemoBlock title={`复选框组${checkboxRed.join()}`}>
      <VanCheckBoxGroup gid="result" value={checkboxRed} onChange={setcheckboxRed}>
        {['a', 'b', 'c'].map(item => {
          return <VanCheckBox
            gid="result"
            key={item}
            name={item}
            custom-class="demo-checkbox"
            className="demo-checkbox"
          >复选框 {item}</VanCheckBox>
        })}
      </VanCheckBoxGroup>
    </DemoBlock>
    <DemoBlock title={`限制最大可选数 复选框组${checkboxRed.join()}`}>
      <VanCheckBoxGroup gid="result2" value={checkboxRed2} onChange={setcheckboxRed2} max={2}>
        {['a', 'b', 'c'].map(item => {
          return <VanCheckBox
            gid="result2"
            key={item}
            name={item}
            inline
            custom-class="demo-checkbox"
            className="demo-checkbox"
          >复选框 {item}</VanCheckBox>
        })}
      </VanCheckBoxGroup>
    </DemoBlock>
    <DemoBlock title={`搭配单元格组件使用 ${checkboxRed3.join(",")}`}>
      <VanCheckBoxGroup value={checkboxRed3} gid="result3" onChange={setcheckboxRed3}>
        <VanCellGroup>
          {['a', 'b', 'c'].map(item => {
            return <VanCell
              key={item}
              title={`复选框 ${item}`}
              value-class="value-class"
              valueClass="value-class"
              onClick={() => {
                if (checkboxRed3.includes(item)) {
                  setcheckboxRed3(
                    checkboxRed3.filter(val => val !== item)
                  )
                } else {
                  setcheckboxRed3(
                    [...checkboxRed3, item]
                  )
                }
              }}
            >
              <View style={{
                display: 'flex',
                height: "100%",
                alignItems: "center"
              }}>
                <VanCheckBox gid="result3" name={item} />
              </View>
            </VanCell>
          })}
        </VanCellGroup>
      </VanCheckBoxGroup>
    </DemoBlock>
    <DemoBlock title={`单选demo + 搭配单元格组件使用 ${checkboxRed4.join(",")}`}>
      <VanCheckBoxGroup value={checkboxRed4} gid="result4" onChange={setcheckboxRed4}>
        <VanCellGroup>
          {['a', 'b', 'c'].map(item => {
            return <VanCell
              key={item}
              title={`单选框 ${item}`}
              value-class="value-class"
              valueClass="value-class"
              onClick={() => setcheckboxRed4(checkboxRed4.includes(item) ? [] : [item])}
            >
              <View style={{
                display: 'flex',
                height: "100%",
                alignItems: "center"
              }}>
                <VanCheckBox gid="result4" name={item} />
              </View>
            </VanCell>
          })}
        </VanCellGroup>
      </VanCheckBoxGroup>
    </DemoBlock>
  </Block>
}

CheckBoxPage.options = {
  addGlobalClass: true
}
