import Taro from "@tarojs/taro";

import "./index.less";
import dayjs from "dayjs";
import VanPopup, { VanPopupProps } from "../Popup";
import { Block, View, ScrollView } from "@tarojs/components";
import VanToast from "../Toast";
import VanCalHeader from "./components/header";
import VanCalMonth from "./components/month";
import VanButton from "../Button";


export type VanCalendarProps = {
  title?: string;
  color?: string;
  show?: boolean;
  formatter?: VoidFunction;
  confirmText?: string;
  rangePrompt?: string;
  defaultDate?: Array<dayjs.Dayjs>
  allowSameDay?: boolean;
  confirmDisabledText?: string;
  type?: string;
  minDate?: dayjs.Dayjs;
  maxDate?: dayjs.Dayjs;
  position?: VanPopupProps['position'];
  rowHeight?: number | string;
  round?: VanPopupProps['round'];
  poppable?: boolean;
  showMark?: boolean;
  showTitle?: boolean;
  showConfirm?: boolean;
  showSubtitle?: boolean;
  safeAreaInsetBottom?: boolean;
  closeOnClickOverlay?: VanPopupProps['closeOnClickOverlay'];
  maxRange?: string | number;

  // ======================================
  renderTitle?: React.ReactNode;
  renderFooter?: React.ReactNode;
}
const ROW_HEIGHT = 64;

const VanCalendar: Taro.FunctionComponent<VanCalendarProps> = (props) => {
  const {
    title = "日期选择",
    confirmText = "确定",
    type = "single",
    minDate = dayjs(Date.now()),
    maxDate = dayjs(new Date(
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
    closeOnClickOutside = true,
  } = props;

  const Calendar = () => {
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
        {getMonths(minDate, maxDate).map((item, index) => {
          return <View
            id="month{{ index }}"
            className="month"
            data-date="{{ item }}"
          >
            <VanCalMonth
              date={item}
              type={type}
              color={color}
              minDate={minDate}
              maxDate={maxDate}
              showMark={showMark}
              formatter={formatter}
              rowHeight={rowHeight}
              currentDate={currentDate}
              showSubtitle={showSubtitle}
              allowSameDay={allowSameDay}
              showMonthTitle={index !== 0 || !showSubtitle}
              bind:click="onClickDay"
          />
        </View>
        })}
      </ScrollView>
      <View className="van-calendar__footer {{ safeAreaInsetBottom ? 'van-calendar__footer--safe-area-inset-bottom' : '' }}">
        {props.renderFooter}
      </View>
      <View className="van-calendar__footer {{ safeAreaInsetBottom ? 'van-calendar__footer--safe-area-inset-bottom' : '' }}">
        {showConfirm && <VanButton
          round
          block
          type="danger"
          color={color}
          custom-class="van-calendar__confirm"
          disabled={computed.getButtonDisabled(type, currentDate)}
          bind:click="onConfirm"
        >
          {computed.getButtonDisabled(type, currentDate) ?
          confirmDisabledText : confirmText}
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
      show={show}
      round={round}
      position={position}
      closeable={showTitle || showSubtitle}
      closeOnClickOverlay={props.closeOnClickOverlay}
    // bind:enter="onOpen"
    // bind:close="onClose"
    // bind:after-enter="onOpened"
    // bind:after-leave="onClosed"
    >
      {Calendar()}
    </VanPopup> :
    <Block>
      {Calendar()}

      <VanToast id="van-toast" />
    </Block>
  }
</Block>
}

export default VanCalendar;
