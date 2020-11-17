import dayjs from "dayjs";
import { VanPopupProps } from "../Popup";
import Taro, { useRef, useCallback, useState } from "@tarojs/taro";
import { VanCalMonthProps } from "./components/month";
import { useScope } from "../common/utils";

export type inputDate = dayjs.ConfigType;
export type VanCalendarCommonProps = {
  title?: string;
  color?: string;
  show?: boolean;
  formatter?: VanCalMonthProps['formatter'];
  confirmText?: string;
  rangePrompt?: string;
  allowSameDay?: boolean;
  confirmDisabledText?: string;
  minDate?: inputDate;
  maxDate?: inputDate;
  position?: VanPopupProps['position'];
  rowHeight?: number;
  round?: VanPopupProps['round'];
  poppable?: boolean;
  showMark?: boolean;
  showTitle?: boolean;
  showConfirm?: boolean;
  showSubtitle?: boolean;
  safeAreaInsetBottom?: boolean;
  closeOnClickOverlay?: VanPopupProps['closeOnClickOverlay'];
  maxRange?: number;
  // ======================================
  useSlotTitle?: boolean;
  renderTitle?: React.ReactNode;
  useSlotFooter?: boolean;
  renderFooter?: React.ReactNode;

  onClose?: VanPopupProps['onClose']
}

export const getMonths = (minDate: inputDate, maxDate: inputDate) => {
  const months: Array<[dayjs.Dayjs, number]> = [];
  let cursor = dayjs(minDate).set("date", 1)
  do {
    months.push([cursor, cursor.daysInMonth()])
    cursor = cursor.clone().add(1, "month")
  } while (
    cursor.isBefore(maxDate)
  )
  return months
}

/**
 * 绑定滚动节流事件，判断滚动到什么位置显示 subtitle
 * @param showSubtitle
 */
export function useInitRect(showSubtitle: boolean) {
  const self = useRef<{
    contentObserver: null | Taro.IntersectionObserver
  }>({
    contentObserver: null
  });
  const [subtitle, setsubtitle] = useState('');
  const scope = useScope();
  const initRect = useCallback(() => {
    if (self.current.contentObserver !== null) {
      self.current.contentObserver.disconnect()
    }

    if (!showSubtitle) return ; // 这就不用处理了
    // TODO
    // if (process.env.TARO_ENV === "weapp") {
      const contentObserver = Taro.createIntersectionObserver(scope, {
        thresholds: [ 0.5, 0.8],
        observeAll: true,
      });

      contentObserver
      .relativeTo('.van-calendar__body')
      .observe('.month', (res) => {
        if (res.intersectionRatio > 0.5) {
        // if (res.boundingClientRect.top <= res.relativeRect.top) {
          // @ts-ignore
          const date = (res as any).dataset.subtitle as string;
          setsubtitle(
            date
          )
        }
      });
    // }
  }, [setsubtitle, showSubtitle]);

  return [
    subtitle, initRect, setsubtitle
  ] as const
}
export const ROW_HEIGHT = 64;

export const getDayStyle = (type: string | undefined, index: number, date: VanCalMonthProps['date'], rowHeight: VanCalMonthProps['rowHeight'], color?: string) => {
  const style: React.CSSProperties = {};
  const offset = date.get('day');

  if (index === 0){
    style.marginLeft = (100 * offset) / 7 + '%';
  }

  if (rowHeight !== ROW_HEIGHT) {
    style.height = rowHeight
  }
  if (color) {
    if (
      type === 'start' ||
      type === 'end' ||
      type === 'multiple-selected' ||
      type === 'multiple-middle'
    ) {
      style.background = color;
    } else if (type === 'middle') {
      style.color = color
    }
  }
  return style;
}
