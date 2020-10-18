import Taro, { useMemo } from "@tarojs/taro";

import "./index.less";
import dayjs from "dayjs";
import VanCalendarSingle from "./single";
import { VanCalendarCommonProps, inputDate, ROW_HEIGHT } from "./utils";
import VanCalendarRange from "./range";
import VanCalendarMultiple from "./multiple";

export type VanCalendarProps = VanCalendarCommonProps & (
  {
    type?: "single"
    defaultDate?: inputDate
    onUnSelect?: (date: dayjs.Dayjs) => unknown;
    onSelect?: (date: dayjs.Dayjs) => unknown;
    onConfirm?: (date: dayjs.Dayjs) => unknown;
  } | {
    type: "range"
    defaultDate?: [inputDate, inputDate]
    onUnSelect?: (date: [dayjs.Dayjs, dayjs.Dayjs] | [dayjs.Dayjs]) => unknown;
    onSelect?: (date: [dayjs.Dayjs, dayjs.Dayjs] | [dayjs.Dayjs]) => unknown;
    onConfirm?: (date: [dayjs.Dayjs, dayjs.Dayjs] | [dayjs.Dayjs]) => unknown
  } | {
    type: "multiple"
    defaultDate?: inputDate[]
    onUnSelect?: (date: dayjs.Dayjs[]) => unknown;
    onSelect?: (date: dayjs.Dayjs[]) => unknown
    onConfirm?: (date: dayjs.Dayjs[]) => unknown
  }
);

const VanCalendar: Taro.FunctionComponent<VanCalendarProps> = (props) => {

  return props.type === "multiple" ? <VanCalendarMultiple
    title={props.title}
    color={props.color}
    show={props.show}
    formatter={props.formatter}
    confirmText={props.confirmText}
    rangePrompt={props.rangePrompt}
    allowSameDay={props.allowSameDay}
    confirmDisabledText={props.confirmDisabledText}
    minDate={props.minDate}
    maxDate={props.maxDate}
    position={props.position}
    rowHeight={props.rowHeight}
    round={props.round}
    poppable={props.poppable}
    showMark={props.showMark}
    showTitle={props.showTitle}
    showConfirm={props.showConfirm}
    showSubtitle={props.showSubtitle}
    safeAreaInsetBottom={props.safeAreaInsetBottom}
    closeOnClickOverlay={props.closeOnClickOverlay}
    maxRange={props.maxRange}
    useSlotTitle={props.useSlotTitle}
    renderTitle={props.renderTitle}
    useSlotFooter={props.useSlotFooter}
    renderFooter={props.renderFooter}
    onClose={props.onClose}
    type={props.type}
    defaultDate={props.defaultDate}
    onUnSelect={props.onUnSelect}
    onSelect={props.onSelect}
    onConfirm={props.onConfirm}
  /> : props.type === "range" ? <VanCalendarRange
    title={props.title}
    color={props.color}
    show={props.show}
    formatter={props.formatter}
    confirmText={props.confirmText}
    rangePrompt={props.rangePrompt}
    allowSameDay={props.allowSameDay}
    confirmDisabledText={props.confirmDisabledText}
    minDate={props.minDate}
    maxDate={props.maxDate}
    position={props.position}
    rowHeight={props.rowHeight}
    round={props.round}
    poppable={props.poppable}
    showMark={props.showMark}
    showTitle={props.showTitle}
    showConfirm={props.showConfirm}
    showSubtitle={props.showSubtitle}
    safeAreaInsetBottom={props.safeAreaInsetBottom}
    closeOnClickOverlay={props.closeOnClickOverlay}
    maxRange={props.maxRange}
    useSlotTitle={props.useSlotTitle}
    renderTitle={props.renderTitle}
    useSlotFooter={props.useSlotFooter}
    renderFooter={props.renderFooter}
    onClose={props.onClose}
    type={props.type}
    defaultDate={props.defaultDate}
    onUnSelect={props.onUnSelect}
    onSelect={props.onSelect}
    onConfirm={props.onConfirm}
  /> : <VanCalendarSingle
        title={props.title}
        color={props.color}
        show={props.show}
        formatter={props.formatter}
        confirmText={props.confirmText}
        rangePrompt={props.rangePrompt}
        allowSameDay={props.allowSameDay}
        confirmDisabledText={props.confirmDisabledText}
        minDate={props.minDate}
        maxDate={props.maxDate}
        position={props.position}
        rowHeight={props.rowHeight}
        round={props.round}
        poppable={props.poppable}
        showMark={props.showMark}
        showTitle={props.showTitle}
        showConfirm={props.showConfirm}
        showSubtitle={props.showSubtitle}
        safeAreaInsetBottom={props.safeAreaInsetBottom}
        closeOnClickOverlay={props.closeOnClickOverlay}
        maxRange={props.maxRange}
        useSlotTitle={props.useSlotTitle}
        renderTitle={props.renderTitle}
        useSlotFooter={props.useSlotFooter}
        renderFooter={props.renderFooter}
        onClose={props.onClose}
        type={props.type}
        defaultDate={props.defaultDate}
        onUnSelect={props.onUnSelect}
        onSelect={props.onSelect}
        onConfirm={props.onConfirm}
      />
}
VanCalendar.defaultProps = {
  title: "日期选择",
  confirmText: "确定",
  // minDate : (Date.now()),
  // maxDate : (new Date(
  //   new Date().getFullYear(),
  //   new Date().getMonth() + 6,
  //   new Date().getDate()
  // )),
  position: "bottom",
  rowHeight: ROW_HEIGHT,
  round: true,
  poppable: true,
  showMark: true,
  showTitle: true,
  showConfirm: true,
  showSubtitle: true,
  safeAreaInsetBottom: true,
}
export default VanCalendar;
