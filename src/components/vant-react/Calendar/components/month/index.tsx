import Taro, { useState, useMemo, useCallback } from "@tarojs/taro";
import "./index.less";
import { View, Text } from "@tarojs/components";
import dayjs from "dayjs";
import { useMemoClassNames, useMemoBem } from "src/components/vant-react/common/utils";
import { getDayStyle } from "../../utils";

type dayType = "disabled" | "selected" | "" | "start" | "start-end" | "end" | "middle" | "multiple-middle" | "multiple-selected" | undefined
type dayItem = {
  date: dayjs.Dayjs;
  type?: dayType;
  text: number;
  topInfo?: string;
  className?: string;
  bottomInfo?: string
};
export type VanCalMonthProps = {
  date: dayjs.Dayjs;
  type: "single" | "multiple" | "range";
  color?: string;
  minDate: dayjs.Dayjs;
  maxDate: dayjs.Dayjs;
  showMark?: boolean;
  rowHeight: number;

  formatter?: (date: dayItem) => dayItem;
  currentDate: dayjs.Dayjs | dayjs.Dayjs[];
  allowSameDay?: boolean;
  showSubtitle?: boolean;
  showMonthTitle?: boolean;

  onClick: (day: dayjs.Dayjs) => unknown;
}
const VanCalMonth = (props: VanCalMonthProps) => {
  const date = props.date || dayjs();
  const visible = true;

  const classnames = useMemoClassNames();
  const bem = useMemoBem();

  const getDayType = useCallback((day: dayjs.Dayjs) => {
    if (day.isAfter(props.maxDate) || day.isBefore(props.minDate)) {

      return "disabled"
    }

    const currentDate = props.currentDate;

    if (props.type === "single") {
      return day.isSame(currentDate as dayjs.Dayjs) ? 'selected' : ''
    } else if (props.type === "range") {
      if (!Array.isArray(currentDate)) {
        return '';
      }

      const [startDay, endDay] = currentDate;
      if (!startDay) {
        return '';
      }
      const compareToStart = day.isSame(startDay);
      if (!endDay) {
        return compareToStart ? 'start' : ''
      }
      const compareToEnd = day.isSame(endDay);
      if (compareToStart && compareToEnd && props.allowSameDay) {
        return 'start-end';
      }
      if (compareToStart) {
        return 'start';
      }
      if (compareToEnd) {
        return 'end';
      }
      if (day.isAfter(startDay) && day.isBefore(endDay)) {
        return 'middle'
      }
    } else {

      if (!Array.isArray(currentDate)) {
        return '';
      }
      const isSelected = (date) =>
        currentDate.some((item) => item.isSame(date));

      if (isSelected(day)) {
        const prevDay = day.clone().subtract(1, "day");
        const nextDay = day.clone().add(1, "day");
        const prevSelected = isSelected(prevDay);
        const nextSelected = isSelected(nextDay);

        if (prevSelected && nextSelected) {
          return 'multiple-middle';
        }

        if (prevSelected) {
          return 'end';
        }

        return nextSelected ? 'start' : 'multiple-selected';
      }

      return '';
    }
  }, [props.minDate, props.maxDate, props.currentDate, props.allowSameDay]);

  const getBottomInfo = useCallback((type?: string) => {
    if (props.type === "range") {
      if (type === 'start') {
        return '开始';
      }
      if (type === 'end') {
        return '结束';
      }
      if (type === 'start-end') {
        return '开始/结束';
      }
    }
  }, [props.type])

  const days = useMemo(() => {
    const startDate = date;
    if (!startDate) return [];
    const year = startDate.get("year");
    const month = startDate.get("month");
    const totalDay = startDate.daysInMonth();

    return Array.from({ length: totalDay }).map((_, day) => {
      day = day + 1
      const date = dayjs(new Date(year, month, day, 0, 0, 0, 0));
      const type = getDayType(date);

      let config: dayItem = {
        date,
        type,
        text: day,
        bottomInfo: getBottomInfo(type),
      };
      return props.formatter ? props.formatter(config) : config
    })
  }, [
    date, getDayType, getBottomInfo, props.formatter, props.currentDate
  ])

  const getMonthStyle = useMemo(() => {
    if (!visible) {
      return {
        paddingBottom: Math.ceil(
          (date.daysInMonth() + date.get("day")) / 7
        ) * props.rowHeight,

      } as React.CSSProperties
    }
  }, [visible, props.rowHeight, date])

  const getMark = useMemo(() => {
    return date.get("month") + 1
  }, [date])


  const onMonthClick = useCallback((item: dayItem) => {
    if (item.type === "disabled") {
      return ;
    }

    props.onClick(item.date)
  }, [props.onClick]);

  return <View className="van-calendar__month" style={getMonthStyle}>
    {props.showMonthTitle && <View className="van-calendar__month-title">
      {date.format('YYYY年MM月')}
    </View>}
    {visible && <View className="van-calendar__days">
      {props.showMark && <View className="van-calendar__month-mark">
        {getMark}
      </View>}
      {days.map((item, index) => {
        return <View
          key={item.date.format("YYYY_MM_DD")}
          style={getDayStyle(
            item.type, index, item.date, props.rowHeight, props.color
          )}
          className={
            classnames(
              bem('calendar__day', [item.type]),
              item.className
            )
          }
          onClick={()=>onMonthClick(item)}
        >
          {
            <View
              className={item.type === 'selected' ? "van-calendar__selected-day" : ""}
              style={item.type === 'selected' ? {
                background: props.color
              } : ""}
            >
              {item.topInfo &&
                <View className="van-calendar__top-info">
                  {item.topInfo}
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
