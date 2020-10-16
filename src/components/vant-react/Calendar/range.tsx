import Taro, { useMemo, useCallback, useState, useEffect } from "@tarojs/taro";

import { VanCalendarCommonProps, inputDate, getMonths, useInitRect, ROW_HEIGHT } from "./utils";
import dayjs from "dayjs";
import "./index.less";
import { useMemoClassNames } from "../common/utils";
import VanCalHeader from "./components/header";
import { View, ScrollView, Block } from "@tarojs/components";
import VanCalMonth from "./components/month";
import VanButton from "../Button";
import VanPopup from "../Popup";
import VanToast from "../Toast";
import { Toast } from "../Toast/toast";

export type VanCalendarSingleProps = VanCalendarCommonProps & {
  type: "range"
  defaultDate?: [inputDate, inputDate]
  onUnSelect?: (date: [dayjs.Dayjs, dayjs.Dayjs | null]) => unknown;
  onSelect?: (date: [dayjs.Dayjs, dayjs.Dayjs | null]) => unknown;
  onConfirm?: (date: [dayjs.Dayjs, dayjs.Dayjs | null]) => unknown;
}


const VanCalendarSingle: Taro.FunctionComponent<VanCalendarSingleProps> = (props) => {
  const classnames = useMemoClassNames();

  const {
    title = "日期选择",
    confirmText = "确定",
    minDate = (Date.now()),
    maxDate = (new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 6,
      new Date().getDate()
    )),
    position = "bottom",
    rowHeight = ROW_HEIGHT,
    round = true,
    poppable = true,
    showMark = true,
    showTitle = true,
    showConfirm = true,
    showSubtitle = true,
    safeAreaInsetBottom = true,
    // closeOnClickOutside = true,
  } = props;

  const minDay = useMemo(() => dayjs(minDate), [minDate]);
  const maxDay = useMemo(() => dayjs(maxDate), [maxDate]);

  // 获取初始值
  const getInitialDate = useMemo(() => {
    if (props.defaultDate) {
      const [startDay, endDay] = props.defaultDate
      return [
        dayjs(startDay),
        dayjs(endDay)
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

  const [currentDate, setcurrentDate] = useState<[dayjs.Dayjs, dayjs.Dayjs | null]>(getInitialDate);

  const confirmButtonDisable = useMemo(() => !currentDate[0] || !currentDate[1], [currentDate]);

  const [subtitle, initRect] = useInitRect(!!props.showSubtitle);

  const [scrollIntoView, setscrollIntoView] = useState('');
  const onScrollIntoView = useCallback(() => {
    requestAnimationFrame(() => {
      let targetDate = currentDate[0]
      const displayed = props.show || !poppable;
      if (displayed) {
        monthslist.some((month) => {
          if (month[0].isSame(targetDate, "month")) {
            setscrollIntoView(
              `month${month[0].format('DD/MM/YYYY')}`
            )
            return true;
          }

          return false;
        });
      }
    })
  }, [currentDate, props.show, poppable, monthslist]);

  useEffect(() => {
    if (props.show || !poppable) {
      initRect();
      onScrollIntoView();
    }
  }, [props.show, poppable, initRect, onScrollIntoView])
  useEffect(() => {
    setcurrentDate(getInitialDate);
    onScrollIntoView()
  }, [getInitialDate, onScrollIntoView])

  const onConfirm = useCallback(() => {
    if (props.onConfirm) {
      Taro.nextTick(() => {
        if (props.onConfirm) {
          props.onConfirm(
            [currentDate[0].clone(), currentDate[1] ? currentDate[1].clone() : null]
          )
        }
      })
    }
  }, [props.onConfirm, currentDate]);

  const emit = useCallback((date: [dayjs.Dayjs, dayjs.Dayjs | null]) => {
    setcurrentDate(date);
    props.onSelect && props.onSelect(date)
  }, [props.onSelect])

  const checkRange = useCallback((date: [dayjs.Dayjs, dayjs.Dayjs | null]) => {
    if (date[1] === null) return false;
    if (props.maxRange && date[0].clone().add(props.maxRange, 'date').isAfter(date[1])) {
      Toast({
        message: props.rangePrompt || `选择天数不能超过 ${props.maxRange} 天`,
      });
      return false
    }
    return true
  }, [props.maxRange, props.rangePrompt])

  const select = useCallback((date: [dayjs.Dayjs, dayjs.Dayjs | null], complete: boolean = false) => {
    if (complete && date[1] !== null) {
      const valid = checkRange(date);

      if (!valid) {
        // auto selected to max range if showConfirm
        if (showConfirm && props.maxRange) {
          emit([
            date[0],
            date[0].clone().set("day", props.maxRange - 1)
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

  const onClickDay = useCallback((date: dayjs.Dayjs) => {
    const [startDay, endDay] = currentDate;
    if (startDay && !endDay) {
      if (date.isAfter(startDay)) {
        select([startDay, date], true)
      } else if (date.isBefore(startDay)) {
        select([date, null])
      } else if (props.allowSameDay) {
        select([date, date])
      }
    } else {
      select([date, null])
    }
  }, [select, currentDate]);

  const renderCalendar = () => {
    // renderTitle 每次都能获取到当前作用域 `name` 的值
    return <View className="van-calendar">
      <VanCalHeader
        title={title}
        showTitle={showTitle}
        subtitle={subtitle}
        showSubtitle={showSubtitle}
        renderTitle={props.renderTitle}
      />
      <ScrollView className="van-calendar__body" scrollY scrollIntoView={scrollIntoView}>
        {monthslist.map((item, index) => {
          return <View
            id={`month${item[0].format('DD/MM/YYYY')}`}
            className="month"
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
              currentDate={currentDate[1] ? currentDate as any : [currentDate[0]]}
              showSubtitle={showSubtitle}
              allowSameDay={props.allowSameDay}
              showMonthTitle={index !== 0 || !showSubtitle}
              onClick={() => onClickDay(item[0])}
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
        {props.renderFooter}
      </View>
      <View className={
        classnames(
          "van-calendar__footer",
          safeAreaInsetBottom ? 'van-calendar__footer--safe-area-inset-bottom' : ''
        )
      }>
        {showConfirm && <VanButton
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
    </View >
  }
  return <Block>
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
      // bind:enter="onOpen"
      // bind:close="onClose"
      // bind:after-enter="onOpened"
      // bind:after-leave="onClosed"
      >
        {renderCalendar()}
      </VanPopup> :
      <Block>
        {renderCalendar()}
        <VanToast id="van-toast" />
      </Block>
    }
  </Block>
}


VanCalendarSingle.options = {
  addGlobalClass: true
}

export default VanCalendarSingle
