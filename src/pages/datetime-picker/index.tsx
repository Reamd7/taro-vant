import Taro from "@tarojs/taro";
import { useState } from 'react';
import { View } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanDateTimePicker from "src/components/vant-react/DateTimePicker";
import dayjs from "dayjs";

export default function DateTimePicker() {
  const [currentDate1, setcurrentDate1] = useState(
    dayjs(new Date(2018, 2, 31).getTime())
  )
  const [currentDate2, setcurrentDate2] = useState(
    dayjs(new Date(2018, 4, 30).getTime())
  )
  return <View>
    <DemoBlock title="选择完整时间">
      <VanDateTimePicker
        type="YYYY-MM-DD HH:mm:ss"
        defaultValue={dayjs(new Date(2020, 1, 29, 0, 0, 0))}
        onChange={(val)=>{
          console.log(val)
        }}
      />
    </DemoBlock>
    <DemoBlock title="选择完整时间 受控组件">
      <VanDateTimePicker
        type="YYYY-MM-DD HH:mm:ss"
        minDate={new Date(2018, 0, 1).getTime()}
        value={currentDate1}
        onChange={(val)=>{
          console.log(val)
          setcurrentDate1(val)
        }}
      />
    </DemoBlock>
    <DemoBlock title="选择年月日 受控组件">
      <VanDateTimePicker
        type="YYYY-MM-DD"
        minDate={new Date(2018, 0, 1).getTime()}
        maxDate={new Date(2019, 10, 1).getTime()}
        value={currentDate2}
        title="立即分享给好友"
        onChange={(val)=>{
          console.log(val)
          setcurrentDate2(val)
        }}
        formatter={(type, value)=>{
          if (type === "YYYY") {
            return value + "年"
          } else if (type === "MM") {
            return value + "月"
          } else {
            return value + "日"
          }
        }}
        filter={(type, val) => {
          if (type === "DD") {
            return Number(val) % 5 === 0
          }
          return true
        }}
      />
    </DemoBlock>
  </View>
}

DateTimePicker.config = {
  "navigationBarTitleText": "DatetimePicker 时间选择"
}
