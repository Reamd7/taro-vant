import Taro from "@tarojs/taro";
const { useState } = Taro /** api **/;
import { Block, View } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanDropDownMenu from "src/components/vant-react/DropDown/VanDropDownMenu";
import VanDropDownItem from "src/components/vant-react/DropDown/VanDropDownItem";
import VanCell from "src/components/vant-react/Cell";
import VanSwitch from "src/components/vant-react/Switch";
import { useMemoAddUnit } from "src/components/vant-react/common/utils";
import VanButton from "src/components/vant-react/Button";
const option1 = [
  { text: '全部商品', value: '0' },
  { text: '新款商品', value: '1' },
  { text: '活动商品', value: '2' }
]
const option2 = [
  { text: '默认排序', value: 'a' },
  { text: '好评排序', value: 'b' },
  { text: '销量排序', value: 'c' }
]
const VanDropDownMenuPage: Taro.FunctionComponent<{}> = () => {
  const [value1, setValue1] = useState("0")
  const [value2, setValue2] = useState('a')

  const [data, setData] = useState({
    switchTitle1: '包邮',
    switchTitle2: '团购',
    itemTitle: '筛选',
    option1: [
      { text: '全部商品', value: '0' },
      { text: '新款商品', value: '1' },
      { text: '活动商品', value: '2' }
    ],
    option2: [
      { text: '默认排序', value: 'a' },
      { text: '好评排序', value: 'b' },
      { text: '销量排序', value: 'c' }
    ],
    switch1: true,
    switch2: false,
  })

  const addUnit = useMemoAddUnit();

  const [activeIndex, setActiveIndex] = useState<null | number>(null)

  return <Block>
    <DemoBlock title="基础用法">
      <VanDropDownMenu gid="1" duration={200}>
        <VanDropDownItem gid="1" index={0} total={2} options={data.option1} value={value1}
        />
        <VanDropDownItem gid="1" index={1} total={2} options={data.option2} value={value2} />
      </VanDropDownMenu>
    </DemoBlock>
    <DemoBlock title="自定义菜单内容">
      <VanDropDownMenu gid="4" duration={200} activeColor="#1989fa" activeIndex={activeIndex} onChange={setActiveIndex}>
        <VanDropDownItem gid="4" index={0} total={2} options={option1} value={value1}
        />
        <VanDropDownItem gid="4" index={1} total={2} title="筛选">
          <VanCell title={data.switchTitle1}
            renderRightIcon={
              <View style={{ height: addUnit(26) }}>
                <VanSwitch
                  size={24}
                  checked={data.switch1}
                  activeColor="#ee0a24"
                  onChange={(e) =>
                    setData(d => {
                      d.switch1 = e;
                      return { ...d }
                    })
                  }
                />
              </View>
            }
          />
          <VanCell title={data.switchTitle2}
            renderRightIcon={
              <View style={{ height: addUnit(26) }}>
                <VanSwitch
                  size={24}
                  checked={data.switch2}
                  activeColor="#ee0a24"
                  onChange={(e) =>
                    setData(d => {
                      d.switch2 = e;
                      return { ...d }
                    })
                  }
                />
              </View>
            }
          />
          <View style={{
            padding: `${addUnit(5)} ${addUnit(16)}`
          }}>
            <VanButton type="danger" block round onClick={() => {
              setActiveIndex(null)
            }}>
              确认
            </VanButton>
          </View>
        </VanDropDownItem>
      </VanDropDownMenu>
    </DemoBlock>
    <DemoBlock title="自定义选中状态颜色">
      <VanDropDownMenu gid="2" duration={200} activeColor="#ee0a24">
        <VanDropDownItem gid="2" index={0} total={2} options={option1} value={value1}
        />
        <VanDropDownItem gid="2" index={1} total={2} options={option2} value={value2} />
      </VanDropDownMenu>
    </DemoBlock>
    <DemoBlock title="向上展开 + 禁用菜单">
      <VanDropDownMenu gid="3" duration={200} direction="up">
        <VanDropDownItem gid="3" index={0} total={2} options={option1} value={value1}
        />
        <VanDropDownItem gid="3" index={1} total={2} disabled options={option2} value={value2} />
      </VanDropDownMenu>
    </DemoBlock>
  </Block>

}
VanDropDownMenuPage.config = {
  "navigationBarTitleText": "Dropdown Menu"
}

export default VanDropDownMenuPage;
