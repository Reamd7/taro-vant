import Taro from "@tarojs/taro";
import { useState } from "react";
import { Block } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanCell from "src/components/vant-react/Cell";
import VanCalendar, { VanCalendarProps } from "src/components/vant-react/Calendar";
import dayjs from "dayjs";

export default function CalendarDemo () {
  const [selectSingle, setselectSingle] = useState<dayjs.Dayjs | null>(null)
  const [show, setShow] = useState(false);
  const [type] = useState<VanCalendarProps['type']>("single");

  return <Block>
    <DemoBlock title="基础用法" />
    <VanCell
      isLink
      title="选择单个日期"
      onClick={()=>{
        setShow(true)
      }}
      value={selectSingle ? selectSingle.format("YYYY/MM/DD") : undefined}
    />
    <VanCalendar
      type={type}
      show={show}
      onConfirm={(date)=>{
        setselectSingle(date);
        console.log(date)
        setShow(false)
      }}
      onClose={()=>{
        setShow(false)
      }}
      maxRange={3}
    />
  </Block>
}
