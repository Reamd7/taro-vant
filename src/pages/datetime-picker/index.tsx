import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanDateTimePicker from "src/components/vant-react/DateTimePicker";
import dayjs from "dayjs";

export default function DateTimePicker() {
  return <View>
    <DemoBlock title="选择完整时间">
      <VanDateTimePicker
        type="YYYY-MM-DD HH:mm:ss"
        defaultValue={dayjs(new Date(2020, 1, 29, 0, 0, 0))}
        onChange={(val)=>{
          console.log(val)
        }}
      ></VanDateTimePicker>
    </DemoBlock>
  </View>
}
