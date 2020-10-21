import Taro, { useMemo, useState } from '@tarojs/taro';
import { Block } from '@tarojs/components';
import DemoBlock from '../components/demoBlock';
import VanPicker from '../../components/vant-react/Picker'
export default function PickerPage() {
  const column1 = useMemo(() => [{
    key: "single",
    values: [{
      title: '杭州',
      disabled: true
    }, {
      title: '宁波',
    }, {
      title: '温州',
    }, {
      title: '嘉兴',
    }, {
      title: '湖州',
    }]
  }], [])


  const [column4, setCol4] = useState([{
    key: "province",
    values: ['浙江', '福建'],
    defaultValue: 0
  }, {
    key: "city",
    values: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
    defaultValue: 2
  }]);

  const [showToolbarValue, setshowToolbarValue] = useState([0])

  const [showRelate, setshowRelate] = useState([0, 2])

  return <Block>
    <DemoBlock title="基础用法 带禁用">
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
        itemHeight={38}
      />
    </DemoBlock>
    <DemoBlock title="展示顶部栏 + 受控组件">
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
    <DemoBlock title="多列联动">
      <VanPicker
        showToolbar
        title="省市区联动"
        valueKey="title"
        value={showRelate}
        columns={column4}
        onChange={(index) => {
          setshowRelate(index)
          if (showRelate[0] !== index[0]) {
            const newcolumn4 = column4.slice();
            switch (index[0]) {
              case 0:
                newcolumn4[1].values = ['杭州', '宁波', '温州', '嘉兴', '湖州']
                break;
              case 1:
                newcolumn4[1].values = ['福州', '厦门', '莆田', '三明']
                break;
            }
            setCol4(newcolumn4)
          }
          console.log(index)
          console.log(index.map((v, i) => column4[i].values[v]))
        }}
        onConfirm={(index) => {
          console.log(index)
          console.log(index.map((v, i) => column4[i].values[v]))
        }}
        onCancel={(index) => {
          setshowRelate(index)
          if (showRelate[0] !== index[0]) {
            const newcolumn4 = column4.slice();
            switch (index[0]) {
              case 0:
                newcolumn4[1].values = ['杭州', '宁波', '温州', '嘉兴', '湖州']
                break;
              case 1:
                newcolumn4[1].values = ['福州', '厦门', '莆田', '三明']
                break;
            }
            setCol4(newcolumn4)
          }
          console.log(index)
          console.log(index.map((v, i) => column4[i].values[v]))
        }}
      />
    </DemoBlock>
    <DemoBlock title="加载状态">
      <VanPicker
        loading
        valueKey="title"
        columns={column1}
        onChange={(index) => {
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
