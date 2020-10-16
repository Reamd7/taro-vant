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

export type VanCalendarSingleProps = VanCalendarCommonProps & {
  type: "multiple"
  defaultDate?: inputDate[]
  onUnSelect?: (date: dayjs.Dayjs[]) => unknown;
  onSelect?: (date: dayjs.Dayjs[]) => unknown
  onConfirm?: (date: dayjs.Dayjs[]) => unknown
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
      return props.defaultDate.map(val => dayjs(val))
    } else {
      return [minDay] as dayjs.Dayjs[]
    }
  }, [props.defaultDate, minDay]);
  // 可用 月份list
  const monthslist = useMemo(() => getMonths(minDate, maxDate), [minDate, maxDate])

  const [currentDate, setcurrentDate] = useState(getInitialDate);

  const confirmButtonDisable = useMemo(() => !!currentDate.length, [currentDate]);

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
      const equal = dateItem[0].isSame(date) === 0;
      if (equal) {
        selectedIndex = index;
      }
      return equal;
    });

    if (selected && selectedIndex !== undefined) {
      const cancelDate = currentDate.splice(selectedIndex, 1);
      setcurrentDate(currentDate)
      unselect(cancelDate);
    } else {
      select([...currentDate, date]);
    }
  }, [select, currentDate, unselect]);

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
