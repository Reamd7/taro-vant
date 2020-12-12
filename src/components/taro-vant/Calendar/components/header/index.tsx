import Taro from "@tarojs/taro";

import "./index.less";
import { View, Block } from "@tarojs/components";

export type VanCalHeaderProps = {
  title?: string;
  subtitle?: string;
  showTitle?: boolean
  showSubtitle?: boolean
  useSlotTitle?: boolean;
  renderTitle?: React.ReactNode
}
const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
const VanCalHeader: Taro.FunctionComponent<VanCalHeaderProps> = (props) => {
  const {
    title = "日期选择"
  } = props
  return <View className="van-calendar__header">
    {props.showTitle && <Block>
      {props.useSlotTitle ? <View className="van-calendar__header-title">
        {props.renderTitle}
      </View> :
        <View className="van-calendar__header-title">
          {title}
        </View>}
    </Block>}
    {props.showSubtitle && <View className="van-calendar__header-subtitle">
      {props.subtitle}
    </View>}
    <View className="van-calendar__weekdays">
      {weekdays.map(item => {
        return <View className="van-calendar__weekday" key={item}>
          {item}
        </View>
      })}
    </View>
  </View>
}

VanCalHeader.options = {
  addGlobalClass: true
}


export default VanCalHeader;
