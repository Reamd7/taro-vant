import Taro, { useState, useMemo, useCallback } from "@tarojs/taro";
import "./index.less";
import { View, Text } from "@tarojs/components";
import dayjs from "dayjs";
import { useMemoClassNames, useMemoBem } from "src/components/vant-react/common/utils";
import { getDayStyle } from "./utils";

export type VanCalMonthProps = {
  date: dayjs.Dayjs;
  type: "single" | "multiple" | "range";
  color?: string;
  minDate: dayjs.Dayjs;
  maxDate: dayjs.Dayjs;
  showMark?: boolean;
  rowHeight: number;

  formatter?: (date: {
    date: dayjs.Dayjs;
    type?: string;
    text: number;
    topInfo?: string;
    className?: string;
    bottomInfo?: string
  }) => {
    date: dayjs.Dayjs;
    type?: string;
    text: number;
    topInfo?: string;
    className?: string;
    bottomInfo?: string
  };
  currentDate: dayjs.Dayjs | dayjs.Dayjs[];
  allowSameDay?: boolean;
  showSubtitle?: boolean;
  showMonthTitle?: boolean;

  onClick: VoidFunction;
}
const VanCalMonth = (props: VanCalMonthProps) => {
  const [visible, setvisible] = useState(true);

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
    const startDate = props.date;
    const year = startDate.get("year");
    const month = startDate.get("month");

    const totalDay = startDate.daysInMonth();

    return Array.from({ length: totalDay }).map((_, day) => {
      const date = dayjs(new Date(year, month, day, 0, 0, 0, 0));
      const type = getDayType(date);

      let config: {
        date: dayjs.Dayjs;
        type?: string;
        text: number;
        topInfo?: string;
        className?: string;
        bottomInfo?: string
      } = {
        date,
        type,
        text: day,
        bottomInfo: getBottomInfo(type),
      };
      return props.formatter ? props.formatter(config) : config
    })
  }, [
    props.date, getDayType, getBottomInfo, props.formatter
  ])

  const getMonthStyle = useMemo(() => {
    if (!visible) {
      return {
        paddingBottom: Math.ceil(
          (props.date.daysInMonth() + props.date.get("day")) / 7
        ) * props.rowHeight
      } as React.CSSProperties
    }
  }, [visible, props.rowHeight, props.date])

  const getMark = useMemo(() => {
    return props.date.get("month")
  }, [props.date])


  return <View className="van-calendar__month" style={getMonthStyle}>
    {props.showMonthTitle && <View className="van-calendar__month-title">
      "{props.date.format('YYYY年MM月')}"
    </View>}
    {visible && <View className="van-calendar__days">
      {props.showMark && <View className="van-calendar__month-mark">
        {getMark}
      </View>}
      {days.map((item, index) => {
        return <View
          style={getDayStyle(
            item.type, index, item.date, props.rowHeight, props.color
          )}
          className={
            classnames(
              bem('calendar__day', [item.type]),
              item.className
            )
          }
          onClick={props.onClick}
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
