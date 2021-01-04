import Taro from "@tarojs/taro";
const { useMemo, useCallback, useState, useEffect } = Taro /** api **/;
import { VanCalendarCommonProps, inputDate, getMonths, useInitRect, ROW_HEIGHT } from "./utils";
import dayjs from "dayjs";
import "./index.less";
import { useMemoClassNames, nextTick, ActiveProps } from "../utils"
import VanCalHeader from "./components/header";
import { View, ScrollView } from "@tarojs/components";
import VanCalMonth from "./components/month";
import VanButton from "../Button";
import VanPopup from "../Popup";
import usePersistFn from "../hooks/usePersistFn"
export type VanCalendarSingleProps = VanCalendarCommonProps & {
  type: "multiple"
  defaultDate?: inputDate[]
  onUnSelect?: (date: dayjs.Dayjs[]) => unknown;
  onSelect?: (date: dayjs.Dayjs[]) => unknown
  onConfirm?: (date: dayjs.Dayjs[]) => unknown
}
const DefaultProps = {
  title: "日期选择",
  confirmText: "确定",
  position: "bottom",
  rowHeight: ROW_HEIGHT,
  round: true,
  poppable: true,
  showMark: true,
  showTitle: true,
  showConfirm: true,
  showSubtitle: true,
  safeAreaInsetBottom: true,
} as const
type ActiveVanCalendarSingleProps = ActiveProps<VanCalendarSingleProps, keyof typeof DefaultProps>

const VanCalendarMultiple: Taro.FunctionComponent<VanCalendarSingleProps> = (props: ActiveVanCalendarSingleProps) => {
  const classnames = useMemoClassNames();
  const today = useMemo(() => dayjs().set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0), []);
  const todayAfter6Month = useMemo(() => today.clone().add(6, "month"), [today]);

  const {
    title,
    confirmText,
    minDate = (today),
    maxDate = (todayAfter6Month),
    position,
    rowHeight,
    round,
    poppable,
    showMark,
    showTitle,
    showConfirm,
    showSubtitle,
    safeAreaInsetBottom,
    // closeOnClickOutside = true,
  } = props;
  const CalendarId = useMemo(() => `VanCalendar_${Math.random().toString().split(".")[1]}`, [])

  const minDay = useMemo(() => dayjs(minDate).set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0), [minDate]);
  const maxDay = useMemo(() => dayjs(maxDate).set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0), [maxDate]);

  // 获取初始值
  const getInitialDate = useMemo(() => {
    if (props.defaultDate) {
      return props.defaultDate.map(val => dayjs(val).set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0))
    } else {
      return [minDay] as dayjs.Dayjs[]
    }
  }, [props.defaultDate, minDay]);
  // 可用 月份list
  const monthslist = useMemo(() => getMonths(minDate, maxDate), [minDate, maxDate])

  const [currentDate, setcurrentDate] = useState(getInitialDate);

  const confirmButtonDisable = useMemo(() => !currentDate.length, [currentDate]);

  const [subtitle, initRect] = useInitRect(CalendarId, !!props.showSubtitle);

  const [scrollIntoView, setscrollIntoView] = useState('');
  const onScrollIntoView = usePersistFn(() => {
    nextTick(() => {
      let targetDate = currentDate[0]
      const displayed = props.show || !poppable;
      if (displayed) {
        monthslist.some((month) => {
          if (month[0].isSame(targetDate, "month")) {
            setscrollIntoView(
              `month${month[0].format('DD_MM_YYYY')}`
            )
            return true;
          }

          return false;
        });
      }
    })
  }, [currentDate, props.show, poppable, monthslist]);

  useEffect(() => {
    if (props.show) {
      initRect();
      onScrollIntoView();
    }
  }, [props.show])
  // useEffect(() => {
  //   if (props.show || !poppable) {
  //     initRect();
  //     onScrollIntoView();
  //   }
  // }, [props.show, poppable, initRect, onScrollIntoView])
  useEffect(() => {
    onScrollIntoView()
  }, [currentDate, onScrollIntoView])

  const onConfirm = usePersistFn(() => {
    if (props.onConfirm) {
      nextTick(() => {
        if (props.onConfirm) {
          props.onConfirm(
            currentDate.map(val => val.clone())
          )
        }
      })
    }
  }, [props.onConfirm, currentDate]);

  const emit = useCallback((date: dayjs.Dayjs[]) => {
    setcurrentDate(date);
    props.onSelect && props.onSelect(date)
  }, [props.onSelect])

  const select = useCallback((date: dayjs.Dayjs[], complete: boolean = false) => {
    emit(date);

    if (complete && !showConfirm) {
      onConfirm();
    }
  }, [emit, showConfirm, onConfirm, props.maxRange])

  const unselect = useCallback((dateArray: dayjs.Dayjs[]) => {
    if (props.onUnSelect) {
      props.onUnSelect(dateArray.map(val => val.clone()))
    }
  }, [props.onUnSelect]);

  const onClickDay = useCallback((date: dayjs.Dayjs) => {
    let selectedIndex: number | undefined = undefined;

    const selected = currentDate.some((dateItem, index: number) => {
      if (dateItem === null) return false;
      const equal = dateItem.isSame(date);
      if (equal) {
        selectedIndex = index;
      }
      return equal;
    });

    if (selected && selectedIndex !== undefined) {
      const arr = currentDate.slice(); // TODO 优化这里的处理
      const cancelDate = arr.splice(selectedIndex, 1);
      setcurrentDate(arr)
      unselect(cancelDate);
    } else {
      select([...currentDate, date]);
    }
  }, [select, currentDate, unselect]);

  const renderTemp = <View className="van-calendar">
    <VanCalHeader
      title={title}
      showTitle={showTitle}
      subtitle={subtitle}
      showSubtitle={showSubtitle}
      useSlotTitle={props.useSlotTitle}
      renderTitle={props.renderTitle}
    />
    <ScrollView className="van-calendar__body" scrollY scrollIntoView={scrollIntoView}>
      {monthslist.map((item, index) => {
        return <View
          key={`month${item[0].format('DD_MM_YYYY')}`}
          id={item[0].format('YYYY年MM月')}
          className="month"
          data-subtitle={item[0].format('YYYY年MM月')} // initRect 使用
        >
          <VanCalMonth
            date={item[0]}
            type={"multiple"}
            color={props.color}
            minDate={minDay}
            maxDate={maxDay}
            showMark={showMark}
            formatter={props.formatter}
            rowHeight={rowHeight}
            currentDate={currentDate}
            showSubtitle={showSubtitle}
            allowSameDay={props.allowSameDay}
            showMonthTitle={index !== 0 || !showSubtitle}
            onClick={onClickDay}
          />
        </View>
      })}
    </ScrollView>
    <View className={
      classnames(
        "van-calendar__footer",
        safeAreaInsetBottom ? 'van-calendar__footer--safe-area-inset-bottom' : ''
      )
    }>
      {props.useSlotFooter ? props.renderFooter : showConfirm && <VanButton
        round
        block
        type="danger"
        color={props.color}
        className="van-calendar__confirm"
        custom-class="van-calendar__confirm"
        disabled={confirmButtonDisable}
        onClick={onConfirm}
      >
        {confirmButtonDisable ? props.confirmDisabledText : confirmText}
      </VanButton>}
    </View>
  </View>

  return <View id={CalendarId}>
    {poppable ?
      <VanPopup
        custom-class={`van-calendar__popup--${position}`}
        className={`van-calendar__popup--${position}`}
        closeIconClass="van-calendar__close-icon"
        show={props.show} // 必为受控组件
        round={round}
        position={position}
        closeable={showTitle || showSubtitle}
        closeOnClickOverlay={props.closeOnClickOverlay}
        onClose={props.onClose}
        style={{ overflow: 'hidden' }}
        // bind:enter="onOpen"
        // bind:close="onClose"
        // bind:after-enter="onOpened"
        // bind:after-leave="onClosed"
        onAfterEnter={() => {
          // 初始化
          initRect();
          onScrollIntoView();
        }}
      >
        {renderTemp}
      </VanPopup> :
      renderTemp
    }
  </View>
}


VanCalendarMultiple.options = {
  addGlobalClass: true
}
VanCalendarMultiple.defaultProps = DefaultProps
export default VanCalendarMultiple
