import Taro from "@tarojs/taro";
const { useMemo, useCallback, useState, useEffect } = Taro /** api **/;
import { VanCalendarCommonProps, inputDate, getMonths, useInitRect, ROW_HEIGHT } from "./utils";
import dayjs from "dayjs";
import { useMemoClassNames, nextTick, ActiveProps } from "../utils"
import VanCalHeader from "./components/header";
import { View, ScrollView } from "@tarojs/components";
import VanCalMonth from "./components/month";
import VanButton from "../../Button";
import VanPopup from "../Popup";

import "./index.less";
import usePersistFn from "../hooks/usePersistFn"

export type VanCalendarSingleProps = VanCalendarCommonProps & {
  type?: "single"
  defaultDate?: inputDate
  onUnSelect?: (date: dayjs.Dayjs) => unknown;
  onSelect?: (date: dayjs.Dayjs) => unknown;
  onConfirm?: (date: dayjs.Dayjs) => unknown;
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

const VanCalendarSingle: Taro.FunctionComponent<VanCalendarSingleProps> = (props: ActiveVanCalendarSingleProps) => {
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
  const CalendarId = useMemo(()=>  `VanCalendar_${Math.random().toString().split(".")[1]}`, [])
  const minDay = useMemo(() => dayjs(minDate), [minDate]);
  const maxDay = useMemo(() => dayjs(maxDate), [maxDate]);

  // 获取初始值
  const getInitialDate = useMemo(() => props.defaultDate ? dayjs(props.defaultDate).set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0) : minDay, [props.defaultDate, minDay]);
  // 可用 月份list
  const monthslist = useMemo(() => getMonths(minDay, maxDay), [minDay, maxDay])
  // 当前日期
  const [currentDate, setcurrentDate] = useState<dayjs.Dayjs>(getInitialDate);
  // 确认按钮的禁用状态
  const confirmButtonDisable = useMemo(() => currentDate === null, [currentDate]);
  // subtitle
  const [subtitle, initRect, setsubtitle] = useInitRect(CalendarId, !!props.showSubtitle);
  // 滚动到某个月份
  const [scrollIntoView, setscrollIntoView] = useState('');
  const onScrollIntoView = usePersistFn(() => {
    nextTick(() => {
      let targetDate = currentDate
      const displayed = props.show || !poppable;
      if (targetDate && displayed) {
        monthslist.some((month) => {
          if (targetDate && month[0].isSame(targetDate, "month")) {
            console.log(`month${month[0].format('DD_MM_YYYY')}`)

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
    // setcurrentDate(getInitialDate);
    onScrollIntoView()
  }, [currentDate, onScrollIntoView]);

  // 确认事件
  const onConfirm = usePersistFn(() => {
    if (props.onConfirm && currentDate) {
      nextTick(() => {
        if (props.onConfirm && currentDate) {
          props.onConfirm(
            currentDate.clone()
          )
        }
      })
    }
  }, [props.onConfirm, currentDate]);

  const emit = useCallback((date: dayjs.Dayjs) => {
    setcurrentDate(date);
    props.onSelect && props.onSelect(date)
  }, [props.onSelect])

  const select = useCallback((date: dayjs.Dayjs, complete: boolean = false) => {
    emit(date);

    if (complete && !showConfirm) {
      onConfirm();
    }
  }, [emit, showConfirm, onConfirm])

  // 点击日期事件
  const onClickDay = usePersistFn((date: dayjs.Dayjs) => {
    select(date, true);
    setsubtitle(date.format('YYYY年MM月'))
  }, [select]);

  const renderTemp = <View className="van-calendar">
    <VanCalHeader
      title={title}
      showTitle={showTitle}
      subtitle={subtitle}
      showSubtitle={showSubtitle}
      useSlotTitle={props.useSlotTitle}
      renderTitle={props.renderTitle}
    />
    <ScrollView className="van-calendar__body" scrollY scrollIntoView={scrollIntoView} scrollWithAnimation>
      {monthslist.map((item, index) => {
        return <View
          key={`month${item[0].format('DD_MM_YYYY')}`}
          id={item[0].format('YYYY年MM月')}
          className="month"
          data-subtitle={item[0].format('YYYY年MM月')} // initRect 使用
        >
          <VanCalMonth
            date={item[0]}
            type={"single"}
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
        onAfterEnter={()=>{
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
VanCalendarSingle.defaultProps = DefaultProps

VanCalendarSingle.options = {
  addGlobalClass: true
}

export default VanCalendarSingle
