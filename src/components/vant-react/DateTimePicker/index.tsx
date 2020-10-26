import Taro, { useMemo, useState, useCallback } from '@tarojs/taro';
import VanPicker from '../Picker';
import dayjs from 'dayjs';
import toArray from "dayjs/plugin/toArray";
dayjs.extend(toArray)
import useUpdateEffect from 'src/common/hooks/useUpdateEffect';
export type inputDate = dayjs.ConfigType;
export type VanDateTimePickerProps = {
  title?: string
  itemHeight?: number
  showToolbar?: boolean
  visibleItemCount?: number
  confirmButtonText?: string;
  cancelButtonText?: string;
  loading?: boolean;

  type: "YYYY" | "YYYY-MM-DD" | "MM-DD" | "HH:mm" | "HH:mm:ss" | "YYYY-MM-DD HH:mm:ss" | "YYYY-MM-DD HH:mm"
  minDate?: inputDate;
  maxDate?: inputDate;
  minHour?: number;
  maxHour?: number;
  minMinute?: number;
  maxMinute?: number;
  minSecond?: number;
  maxSecond?: number;

  value?: dayjs.Dayjs;
  defaultValue?: dayjs.Dayjs
  onChange?: (val: dayjs.Dayjs) => void;
  onConfirm?: (val: dayjs.Dayjs) => void;
  onCancel?: (val: dayjs.Dayjs) => void;

  formatter?: (type: string, value: string) => string
  filter?: (type: "YYYY" | "MM" | "DD" | "HH" | "mm" | "ss", value: string) => boolean
}

const DefaultProps = {
  showToolbar: true,
  cancelButtonText: "取消",
  confirmButtonText: "确认",
  visibleItemCount: 6,
  itemHeight: 44,
  type: "YYYY-MM-DD",
  loading: false,
  // minDate: today.clone().subtract(10, "year").set("month", 1).set("day", 1),
  // maxDate: today.clone().add(10, "year").set("month", 12).set("day", 31)
  minHour: 0,
  maxHour: 23,
  minMinute: 0,
  maxMinute: 59,
  minSecond: 0,
  maxSecond: 59
} as const
type DefaultKey = keyof typeof DefaultProps
type ActiceProps = Omit<VanDateTimePickerProps, DefaultKey> & Required<Pick<VanDateTimePickerProps, DefaultKey>>

const MM = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
const DD31 = Array.from({ length: 31 }).map((_, i) => String(i + 1))
const DD30 = Array.from({ length: 30 }).map((_, i) => String(i + 1))
const DD28 = Array.from({ length: 28 }).map((_, i) => String(i + 1))
const DD29 = Array.from({ length: 29 }).map((_, i) => String(i + 1))
const DDMap = {
  31: DD31,
  30: DD30,
  29: DD29,
  28: DD28,
}
const List24 = Array.from({ length: 24 }).map((_, i) => String(i))
const List60 = Array.from({ length: 60 }).map((_, i) => String(i))
/**
 * 受控组件：
 * 1、props.value => updateValueByDayjs
 * => 转化为符合 maxDate ~ minDate 范围的合法dayjs.Dayjs 值
 * => 更新DayList（有可能变月份了导致这个列需要被改变，但我又需要根据给定的value生成对应的dayList）[已经准备好因为更新value而改变的columns了]
 * => 根据value值以及List，生成对应的index值
 * => 更新value 以及 pickerIndex
 *
 * 2. onChange 中，将index 转化为nextState 的 value dayjs.Dayjs值。调用1的流程。
 *
 * 非受控组件：
 * 组合1、2产生新的函数，减少一次计算DayList，不需要判断合法性，
 * @param props
 */
const VanDateTimePicker: Taro.FunctionComponent<VanDateTimePickerProps> = (props: ActiceProps) => {
  const today = useMemo(() => dayjs(), []);
  const minDate = useMemo(() => props.minDate ? dayjs(props.minDate) : today.clone().subtract(10, "year").set("month", 0).set("day", 1), [props.minDate]);
  const maxDate = useMemo(() => props.maxDate ? dayjs(props.maxDate) : today.clone().add(10, "year").set("month", 11).set("day", 31), [props.maxDate]);

  const filter = useCallback((type: "YYYY" | "MM" | "DD" | "HH" | "mm" | "ss", Val: string[]) => {
    if (props.filter) {
      return Val.filter(val => {
        return props.filter!(type, val)
      })
    }
    return Val
  }, [props.filter]);
  const normalList = useCallback((type: "YYYY" | "MM" | "DD" | "HH" | "mm" | "ss", Val: string[]) => {
    if (props.type.includes(type)) {
      return filter(type, Val)
    }
    return [];
  }, [props.type, filter])

  const illegalValue = useCallback((val: dayjs.Dayjs | undefined) => {
    const value = val ? val : today;
    if (value.isAfter(maxDate)) return maxDate;
    if (value.isBefore(minDate)) return minDate;
    return value;
  }, [minDate, maxDate]);

  const [value, _setValue] = useState(() => {
    if ('value' in props) {
      return illegalValue(props.value)
    }
    if ('defaultValue' in props) {
      return illegalValue(props.defaultValue) // 默认值
    }
    return today
  });

  // ================================================
  const updateDayList = useCallback((val: dayjs.Dayjs = value) => {
    if (props.type.includes("DD")) {
      // const currentYear = val.get("year");
      // const currentMonth = val.get("month");
      const daysINMonth = val.daysInMonth() as 31 | 30 | 29 | 28;

      return filter("DD", DDMap[daysINMonth])
    }
    return []
  }, [props.type, value, filter]);
  const YearList = useMemo(() => {
    if (props.type.includes("YYYY")) {
      const minYear = minDate.get("year");
      const yearDiff = Math.ceil(
        maxDate.diff(minDate, 'year', true)
      );
      if (yearDiff < 0) throw Error("Error Maxdate");
      const YYYY = Array.from<string>({ length: yearDiff })
        .reduce((res, _, index) => {
          res.push(
            res[index] + 1
          )
          return res;
        }, [minYear]).map(String)
      return filter("YYYY", YYYY)
    }
    return []
  }, [props.type, minDate, maxDate, filter])
  const MonthList = useMemo(() => normalList("MM", MM), [normalList]);

  // const [DayList, setDayList] = useState(() => updateDayList())
  // useEffect(()=>{
  //   setDayList(updateDayList())
  // }, [props.type, filter])
  const DayList = useMemo(() => updateDayList(), [props.type, value, filter]);
  const HourList = useMemo(() => normalList("HH", List24), [normalList]);
  const MinuteList = useMemo(() => normalList("mm", List60), [normalList]);
  const SecondList = useMemo(() => normalList("ss", List60), [normalList]);

  ///////
  const ListMap = useMemo(() => {
    return {
      "YYYY": props.type.includes("YYYY") ? YearList : null,
      "MM": props.type.includes("MM") ? MonthList : null,
      "DD": props.type.includes("DD") ? DayList : null,
      "HH": props.type.includes("HH") ? HourList : null,
      "mm": props.type.includes("mm") ? MinuteList : null,
      "ss": props.type.includes("ss") ? SecondList : null,
    } as const
  }, [props.type, YearList, MonthList, DayList, HourList, MinuteList, SecondList])
  // ================================================

  /**
   * 列 columns
   */
  const columns = useMemo(() => {
    const valList = value.toArray();
    return ["YYYY", "MM", "DD", "HH", "mm", "ss"].reduce((res, key, index) => {
      if (ListMap[key]) {
        res.push({
          key,
          values: ListMap[key],
          defaultIndex: ListMap[key].indexOf(String(valList[index]))
        })
      }
      return res;
    }, [] as Array<{
      key: string;
      values: string[];
      defaultIndex?: number
    }>)
  }, [value, ListMap])

  /**
   * 已选择的列
   */
  const [pickerIndex, setPickerIndex] = useState<number[]>(() => {
    const valList = value.toArray();
    return ["YYYY", "MM", "DD", "HH", "mm", "ss"].reduce((res, key, index) => {
      if (ListMap[key]) {
        if (key === "MM") {
          res.push(
            ListMap[key]!.indexOf(String(valList[index] + 1))
          )
        } else {
          res.push(
            ListMap[key]!.indexOf(String(valList[index]))
          )
        }
      }
      return res;
    }, [] as Array<number>)
  });
  // ===============================================

  // 根据日期值更新。
  // 主要是考虑如何复用columns的问题。
  const updateValueByDayjs = useCallback((val: dayjs.Dayjs) => {
    // 确定合法值 value
    val = illegalValue(val); // 根据最大最小值过滤一层

    if (val.isSame(value)) {
      _setValue(val)
      setPickerIndex(pickerIndex.slice())
      return;
    }

    // ========= 更新DayList ==========

    const valList = val.toArray()
    // if (valYear !== valueYear || valMonth !== valueMonth) {
    //   DayList.current = updateDayList(val);
    // }
    // -----------------------------------------------
    // 根据传入的 val 进行解构取值。
    // 因为 filter 的原因，可能 val 的值取不到 filter 过的 array，这里用报错提示出去吧，
    // TODO 以后考虑怎么处理
    const dateString = val.toISOString()
    const indexList = ["YYYY", "MM", "DD", "HH", "mm", "ss"].reduce((res, key, index) => {
      if (ListMap[key]) {
        if (key === 'MM') {
          const newIndex = ListMap[key]!.indexOf(String(valList[index] + 1))
          if (newIndex < 0) {
            throw new Error(`After filter MM not include ${valList[index]}, active value is ${dateString}`);
          }
          res.push(newIndex)
        } else if (key === "DD") {
          const DayList = updateDayList(dayjs(new Date(
            valList[0], valList[1]
          )))
          const newIndex = DayList.indexOf(String(valList[index]));
          if (newIndex < 0) {
            throw new Error(`After filter DD not include ${valList[index]}, active value is ${dateString}`);
          }
          res.push(newIndex)
        } else {
          const newIndex = ListMap[key].indexOf(String(valList[index]))
          if (newIndex < 0) {
            throw new Error(`After filter ${key} not include ${valList[index]}, active value is ${dateString}`);
          }
          res.push(newIndex)
        }
      }
      return res;
    }, [] as number[]);
    // -----------------------------------------------
    setPickerIndex(indexList.slice())
    _setValue(val.clone())
  }, [props.type, ListMap, value, illegalValue, pickerIndex]);

  // 1. 受控组件
  useUpdateEffect(() => {
    if ('value' in props) {
      updateValueByDayjs(props.value!)
    }
  }, [props.value])

  // 2. onChange 时候主动触发的，如果是受控组件，即转换为 合法的 dayjs 对象，传递出去
  // 如果不是受控组件就能精简一点。
  const pickerIndex2Dayjs = useCallback((index: number[]) => {
    const valueYear = value.get("year");
    const valueMonth = value.get("month");
    let [
      valYear,
      valMonth,
      valDay,
      valHour,
      valMinute,
      valSecond
    ] = value.toArray();

    let cur = 0;
    if (props.type.includes("YYYY")) {
      valYear = Number(columns[cur].values[
        index[cur]
      ]);
      cur += 1;
    }
    if (props.type.includes("MM")) {
      valMonth = Number(columns[cur].values[
        index[cur]
      ]);
      cur += 1;
    }
    if (props.type.includes("DD")) {
      if (valYear !== valueYear || (valMonth - 1) !== valueMonth) {
        const day = dayjs().set("year", valYear).set("month", valMonth - 1);
        const daysInMonth = day.daysInMonth();
        const oldday = Number(DayList[
          index[cur]
        ])
        valDay = oldday > daysInMonth ? daysInMonth : oldday;
      } else {
        valDay = Number(columns[cur].values[
          index[cur]
        ]);
      }
      cur += 1;
    }
    if (props.type.includes("HH")) {
      valHour = Number(columns[cur].values[
        index[cur]
      ]);
      cur += 1;
    }
    if (props.type.includes("mm")) {
      valMinute = Number(columns[cur].values[
        index[cur]
      ]);
      cur += 1;
    }
    if (props.type.includes("ss")) {
      valSecond = Number(columns[cur].values[
        index[cur]
      ]);
      cur += 1;
    }
    // console.log([valYear, valMonth - 1, valDay, valHour, valMinute, valSecond])
    return dayjs(
      new Date(
        valYear, valMonth - 1, valDay, valHour, valMinute, valSecond
      )
    )
    // .set("year", valYear)
    // .set("month", valMonth - 1)
    // .set("day", valDay)
    // .set("hour", valHour)
    // .set("minute", valMinute)
    // .set("second", valSecond)
  }, [columns, value]);

  return <VanPicker
    className="van-datetime-picker"
    custom-class="van-datetime-picker"
    active-class="active-class"
    activeClass="active-class"
    toolbar-class="toolbar-class"
    toolbarClass="toolbar-class"
    column-class="column-class"
    columnClass="column-class"
    title={props.title}
    itemHeight={props.itemHeight}
    showToolbar={props.showToolbar}
    visibleItemCount={props.visibleItemCount}
    confirmButtonText={props.confirmButtonText}
    cancelButtonText={props.cancelButtonText}
    loading={props.loading}
    valueKey="value"
    value={pickerIndex}
    columns={columns}
    onChange={(val) => {
      // if (val.some(value => isNaN(value))) return;
      const valueDay = pickerIndex2Dayjs(val)
      if (valueDay.isSame(value)) return ; // 其实，这里有两次渲染，因为DayList的重新渲染。
      console.log(val)
      if (props.onChange) {
        props.onChange(valueDay)
      }
      if (!('value' in props)) {
        console.log(valueDay)
        updateValueByDayjs(valueDay)
        // onChange(val)
      }
    }}
    onConfirm={(val) => {
      if (props.onConfirm) {
        props.onConfirm(
          pickerIndex2Dayjs(val)
        )
      }
    }}
    onCancel={(val) => {
      const valueDay = pickerIndex2Dayjs(val)
      if (valueDay.isSame(value)) return ; // 其实，这里有两次渲染，因为DayList的重新渲染。
      console.log(val)
      if (props.onCancel) {
        props.onCancel(valueDay)
      }
      if (!('value' in props)) {
        console.log(valueDay)
        updateValueByDayjs(valueDay)
      }
    }}
  />
}

VanDateTimePicker.options = {
  addGlobalClass: true
}
VanDateTimePicker.defaultProps = DefaultProps

export default VanDateTimePicker;
