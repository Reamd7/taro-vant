import Taro, { useMemo, useState } from '@tarojs/taro';
import { Block } from '@tarojs/components';
import DemoBlock from '../components/demoBlock';
import VanPicker from '../../components/vant-react/Picker'
export default function PickerPage() {
  const column1 = useMemo(() => [{
    key: "single",
    values: ['杭州', '宁波', '温州', '嘉兴', '湖州']
  }], [])

  const [showToolbarValue, setshowToolbarValue] = useState([0])
  return <Block>
    {/* <DemoBlock title="基础用法">
      <VanPicker
        valueKey="title"
        columns={column1}
        onChange={(index) => {
          console.log(index)
          console.log(index.map((v, i) => column1[i].values[v]))
        }}
      />
    </DemoBlock>
    <DemoBlock title="默认选中项">
      <VanPicker
        valueKey="title"
        defaultIndex={2}
        columns={column1}
        onChange={(index) => {
          console.log(index)
          console.log(index.map((v, i) => column1[i].values[v]))
        }}
      />
    </DemoBlock> */}
    <DemoBlock title="展示顶部栏">
      <VanPicker
        showToolbar
        title="标题"
        valueKey="title"
        value={showToolbarValue}
        columns={column1}
        onChange={(index) => {
          setshowToolbarValue(index)
          console.log(index)
          console.log(index.map((v, i) => column1[i].values[v]))
        }}
        onConfirm={(index) => {
          console.log(index)
          console.log(index.map((v, i) => column1[i].values[v]))
        }}
        onCancel={(index) => {
          setshowToolbarValue(index)
          console.log(index)
          console.log(index.map((v, i) => column1[i].values[v]))
        }}
      />
    </DemoBlock>
  </Block>
}

PickerPage.options = {
  navigationBarTitleText: "Picker 选择器"
}
