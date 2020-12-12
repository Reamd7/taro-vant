import Taro from "@tarojs/taro";
const { useState } = Taro /** api **/;
import { Block, View } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanCell from "taro-vant/Cell";
import VanCalendar, { VanCalendarProps } from "taro-vant/Calendar";
import dayjs from "dayjs";
import VanCalendarSingle from "taro-vant/Calendar/single";
import VanCalendarRange from "taro-vant/Calendar/range";
import VanCalendarMultiple from "taro-vant/Calendar/multiple";

export default function CalendarDemo() {
  const [selectSingle, setselectSingle] = useState<dayjs.Dayjs | null>(null)
  const [show, setShow] = useState(false);

  const [selectrange, setselectrange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | [dayjs.Dayjs]>()
  const [rangeshow, setrangeshow] = useState(false);

  const [selectmul, setselectmul] = useState<dayjs.Dayjs[]>([])
  const [selectmulShow, setselectmulShow] = useState(false);


  return <Block>
    <DemoBlock title="基础用法" />
    <VanCell
      isLink
      title="选择单个日期"
      onClick={() => {
        setShow(true)
      }}
      value={selectSingle ? selectSingle.format("YYYY/MM/DD") : undefined}
    />
    <VanCell
      isLink
      title="选择Range日期"
      onClick={() => {
        setrangeshow(true)
      }}
    >
      <View style={{ flex: 1 }}>
        {selectrange ?
          selectrange.length == 1 ? `${selectrange[0].format("YYYY/MM/DD")} -` : `${selectrange[0].format("YYYY/MM/DD")} - ${selectrange[1].format("YYYY/MM/DD")}`
          : ''}
      </View>
    </VanCell>
    <VanCell
      isLink
      title="选择multiple日期"
      onClick={() => {
        setselectmulShow(true)
      }}
    >
      <View style={{ flex: 1 }}>
        {selectmul.map(item => item.format("YYYY/MM/DD")).join(" , ")}
      </View>
    </VanCell>
    <VanCalendarSingle
      type={"single"}
      show={show}
      onConfirm={(date) => {
        setselectSingle(date);
        console.log(date)
        setShow(false)
      }}
      onClose={() => {
        setShow(false)
      }}
    />
    <VanCalendar
      type={"range"}
      show={rangeshow}
      onConfirm={(date) => {
        setselectrange(date);
        console.log(date)
        setrangeshow(false)
      }}
      onClose={() => {
        setrangeshow(false)
      }}
      maxRange={3}
    />
    <VanCalendarMultiple
      type={"multiple"}
      show={selectmulShow}
      onConfirm={(date) => {
        setselectmul(date);
        console.log(date)
        setselectmulShow(false)
      }}
      onClose={() => {
        setselectmulShow(false)
      }}
    />
  </Block>
}
