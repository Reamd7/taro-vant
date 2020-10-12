import Taro, { useState } from "@tarojs/taro";
import "./index.less";
import { View, Text } from "@tarojs/components";
import dayjs from "dayjs";

export type VanCalMonthProps = {
  date?: dayjs.Dayjs;
  type?: string;
  color?: string;
  minDate?: dayjs.Dayjs;
  maxDate?: dayjs.Dayjs;
  showMark?: boolean;
  rowHeight?: [number, string];

  formatter?: (date: dayjs.Dayjs) => unknown;
  currentDate?: Array<dayjs.Dayjs>;
  allowSameDay?: boolean;
  showSubtitle?: boolean;
  showMonthTitle?: boolean;
}
const VanCalMonth: Taro.FunctionComponent<VanCalMonthProps> = (props) => {
  const [visible, setvisible] = useState(true);

  return <View className="van-calendar__month" style="{{ computed.getMonthStyle(visible, date, rowHeight) }}">
    {props.showMonthTitle && <View className="van-calendar__month-title">
      "{computed.formatMonthTitle(date)}"
    </View>}
    {visible && <View className="van-calendar__days">
      {props.showMark && <View className="van-calendar__month-mark">
        {{ computed.getMark(date) }}
      </View>}
      {days.map(item => {
        return <View
          style="{{ computed.getDayStyle(item.type, index, date, rowHeight, color) }}"
          className="{{ utils.bem('calendar__day', [item.type]) }} {{ item.className }}"
          data-index="{{ index }}"
          bindtap="onClick"
        >
          {
            <View
              className={item.type === 'selected' ? "van-calendar__selected-day" : ""}
              style={item.type === 'selected' ? "background: {{ color }}" : ""}
            >
              {item.topInfo &&
                <View className="van-calendar__top-info">
                  {{ item.topInfo }}
                </View>}
              <Text>{item.text}</Text>
              {item.bottomInfo && <View className="van-calendar__bottom-info">
                {item.bottomInfo}
              </View>}
            </View>
          }
        </View>
      })}
    </View>}
  </View >
}

VanCalMonth.options = {
  addGlobalClass: true
}


export default VanCalMonth;
