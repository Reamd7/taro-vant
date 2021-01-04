import Taro from "@tarojs/taro";
const { useMemo, useCallback, useState, useEffect } = Taro /** api **/;
import { VanCalendarCommonProps, inputDate, getMonths, useInitRect, ROW_HEIGHT } from "./utils";
import dayjs from "dayjs";
import "./index.less";
import { useMemoClassNames, nextTick, ActiveProps } from "../utils"
import VanCalHeader from "./components/header";
import { View, ScrollView, Block } from "@tarojs/components";
import VanCalMonth from "./components/month";
import VanButton from "../../Button";
import VanPopup from "../Popup";
import VanToast from "../Toast";
import { Toast, useUniToastId } from "../Toast/toast";
import usePersistFn from "../hooks/usePersistFn"

export type VanCalendarSingleProps = VanCalendarCommonProps & {
  type: "range"
  defaultDate?: [inputDate, inputDate]
  onUnSelect?: (date: [dayjs.Dayjs, dayjs.Dayjs] | [dayjs.Dayjs]) => unknown;
  onSelect?: (date: [dayjs.Dayjs, dayjs.Dayjs] | [dayjs.Dayjs]) => unknown;
  onConfirm?: (date: [dayjs.Dayjs, dayjs.Dayjs] | [dayjs.Dayjs]) => unknown;
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

const VanCalendarRange: Taro.FunctionComponent<VanCalendarSingleProps> = (props: ActiveVanCalendarSingleProps) => {
  const toastId = useUniToastId();

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
      const [startDay, endDay] = props.defaultDate
      return [
        dayjs(startDay).set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0),
        dayjs(endDay).set("hour", 0).set("minute", 0).set("second", 0).set("millisecond", 0)
      ] as [dayjs.Dayjs, dayjs.Dayjs]
    } else {
      return [
        minDay,
        minDay.add(1, 'day')
      ] as [dayjs.Dayjs, dayjs.Dayjs]
    }
  }, [props.defaultDate, minDay]);
  // 可用 月份list
  const monthslist = useMemo(() => getMonths(minDate, maxDate), [minDate, maxDate])

  const [currentDate, setcurrentDate] = useState<[dayjs.Dayjs, dayjs.Dayjs] | [dayjs.Dayjs]>(getInitialDate);

  const confirmButtonDisable = useMemo(() => !currentDate[0] || !currentDate[1], [currentDate]);

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
    // setcurrentDate(getInitialDate);
    onScrollIntoView()
  }, [currentDate, onScrollIntoView]);


  const onConfirm = usePersistFn(() => {
    if (props.onConfirm) {
      nextTick(() => {
        if (props.onConfirm) {
          props.onConfirm(
            currentDate[1] ? [currentDate[0].clone(), currentDate[1].clone()] : [currentDate[0].clone()]
          )
        }
      })
    }
  }, [props.onConfirm, currentDate]);

  const emit = useCallback((date: [dayjs.Dayjs, dayjs.Dayjs] | [dayjs.Dayjs]) => {
    setcurrentDate(date);
    props.onSelect && props.onSelect(date)
  }, [props.onSelect])

  const checkRange = useCallback((date: [dayjs.Dayjs, dayjs.Dayjs] | [dayjs.Dayjs]) => {
    if (date[1] == null) return false;
    if (props.maxRange && date[0].clone().add(props.maxRange, 'day').isBefore(date[1])) {
      Toast({
        gid: toastId,
        message: props.rangePrompt || `选择天数不能超过 ${props.maxRange} 天`,
      });
      return false
    }
    return true
  }, [props.maxRange, props.rangePrompt])

  const select = useCallback((date: [dayjs.Dayjs, dayjs.Dayjs] | [dayjs.Dayjs], complete: boolean = false) => {
    if (complete && date[1] != null) {
      const valid = checkRange(date);

      if (!valid) {
        // auto selected to max range if showConfirm
        if (showConfirm && props.maxRange) {
          emit([
            date[0],
            date[0].clone().add(props.maxRange, 'day')
          ]);
        } else {
          emit(date);
        }
        return;
      }
    }
    emit(date);

    if (complete && !showConfirm) {
      onConfirm();
    }
  }, [emit, showConfirm, onConfirm, checkRange, props.maxRange])

  const onClickDay = usePersistFn((date: dayjs.Dayjs) => {
    const [startDay, endDay] = currentDate;
    if (startDay && !endDay) {
      if (date.isAfter(startDay)) {
        select([startDay, date], true)
      } else if (date.isBefore(startDay)) {
        select([date])
      } else if (props.allowSameDay) {
        select([date, date])
      }
    } else {
      select([date])
    }
  }, [select, currentDate]);

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
            type={"range"}
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
      <Block>
        {renderTemp}
      </Block>
    }
    <VanToast gid={toastId} />
  </View>
}


VanCalendarRange.options = {
  addGlobalClass: true
}

export default VanCalendarRange
