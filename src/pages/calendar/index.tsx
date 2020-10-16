import Taro, { useState } from "@tarojs/taro";
import { Block, View } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanCell from "src/components/vant-react/Cell";
import VanCalendar, { VanCalendarProps } from "src/components/vant-react/Calendar";

export default function CalendarDemo () {
  const [selectSingle, setselectSingle] = useState(null)
  const [show, setShow] = useState(false);
  const [type, setType] = useState<VanCalendarProps['type']>("range");
  return <Block>
    <DemoBlock title="基础用法" />
    <VanCell
      isLink
      title="选择单个日期"
      onClick={()=>{
        setShow(true)
      }}
    />
    <VanCalendar
      type={type}
      show={show}
      onConfirm={(date)=>{
        console.log(date)
      }}
      onClose={()=>{
        setShow(false)
      }}
      maxRange={3}
    />
  </Block>
}
