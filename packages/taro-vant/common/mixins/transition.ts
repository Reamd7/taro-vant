import Taro from '@tarojs/taro';
import usePersistFn from '../../hooks/usePersistFn';
import { requestAnimationFrame, isNormalClass } from "../../utils";
const { useState, useEffect, useRef, useCallback } = Taro /** api **/;
export type MixinsTransitionProps = {
  style?: React.CSSProperties;
  show?: boolean;
  duration?: number | {
    enter: number;
    leave: number;
  };
  name?: string
} & {
  onBeforeEnter?: VoidFunction;
  onEnter?: VoidFunction;
  onAfterEnter?: VoidFunction;
  onBeforeLeave?: VoidFunction;
  onLeave?: VoidFunction;
  onAfterLeave?: VoidFunction;
} & {
  enterClass?: string;
  ['enter-class']?: string;
  enterActiveClass?: string;
  ['enter-active-class']?: string;
  enterToClass?: string;
  ['enter-to-class']?: string;
  leaveClass?: string;
  ['leave-class']?: string;
  leaveActiveClass?: string;
  ['leave-active-class']?: string;
  leaveToClass?: string;
  ['leave-to-class']?: string;
}
function isObj(x?: number | {
  enter: number;
  leave: number;
}): x is {
  enter: number;
  leave: number;
} {
  const type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}
// const getClassNames = (name: string) => ({
//     enter: `van-${name}-enter van-${name}-enter-active enter-class enter-active-class`,
//     'enter-to': `van-${name}-enter-to van-${name}-enter-active enter-to-class enter-active-class`,
//     leave: `van-${name}-leave van-${name}-leave-active leave-class leave-active-class`,
//     'leave-to': `van-${name}-leave-to van-${name}-leave-active leave-to-class leave-active-class`,
// });
/**
 *
 * @param props
 * @param showDefaultValue
 * @param {string} defaultName 模拟过渡动画的name
 */
export function useMixinsTransition(props: MixinsTransitionProps, showDefaultValue: boolean, defaultName?: string) {
  const { show = showDefaultValue, duration = 300, name = defaultName } = props;

  const status = useRef<'enter' | 'leave'>();

  const transitionEnded = useRef<boolean>();

  // console.log(props, name, status, transitionEnded)
  const checkStatus = useCallback((_status: 'enter' | 'leave') => {
    // if (status.current !== _status) {
    //     throw new Error(`incongruent status: ${_status}`);
    // }
  }, [])

  const getClassNames = useCallback(isNormalClass ? (name: string) => { // TODO 支持RN端。
    return {
      enter: `${name ? `van-${name}-enter van-${name}-enter-active` : ''} ${props.enterClass || ""} ${props.enterActiveClass || ""}`,
      'enter-to': `${name ? `van-${name}-enter-to van-${name}-enter-active` : ''} ${props.enterToClass || ""} ${props.enterActiveClass || ""}`,
      leave: `${name ? `van-${name}-leave van-${name}-leave-active` : ''} ${props.leaveClass || ""} ${props.leaveActiveClass || ""}`,
      'leave-to': `${name ? `van-${name}-leave-to van-${name}-leave-active` : ''} ${props.leaveToClass || ""} ${props.leaveActiveClass || ""}`,
    }
  } : (name: string) => {
    return {
      enter: `${name ? `van-${name}-enter van-${name}-enter-active` : ''} enter-class enter-active-class`,
      'enter-to': `${name ? `van-${name}-enter-to van-${name}-enter-active` : ''} enter-to-class enter-active-class`,
      leave: `${name ? `van-${name}-leave van-${name}-leave-active` : ''} leave-class leave-active-class`,
      'leave-to': `${name ? `van-${name}-leave-to van-${name}-leave-active` : ''} leave-to-class leave-active-class`,
    }
  }, isNormalClass ? [props.enterActiveClass, props.enterClass, props.enterToClass, props.leaveActiveClass, props.leaveClass, props.leaveToClass] : [])

  const [data, setData] = useState({
    inited: false,
    display: false,
    // type: '',
    classes: '',
    currentDuration: 0
  })
  const { onBeforeEnter, onEnter, onBeforeLeave, onLeave, onAfterEnter, onAfterLeave } = props;
  const display = data.display;

  const onTransitionEnd = useCallback(() => {
    if (transitionEnded.current) {
      return;
    }
    transitionEnded.current = true;
    if (status.current === "enter") {
      onAfterEnter && onAfterEnter()
    } else if (status.current === "leave") {
      onAfterLeave && onAfterLeave()
    }
    if (!show && display) {
      setData((data) => ({
        ...data,
        display: false
      }))
      // setDisplay(false)
    }
  }, [display, onAfterEnter, onAfterLeave, show])
  const Enter = usePersistFn(() => {

    const classNames = getClassNames(name!);
    const currentDuration = isObj(duration) ? duration.enter : duration;
    status.current = "enter";
    onBeforeEnter && onBeforeEnter();
    requestAnimationFrame(() => {
      checkStatus('enter');
      onEnter && onEnter();

      setData({
        inited: true,
        classes: classNames.enter,
        currentDuration,
        display: true
      })
      // setDisplay(true)

      requestAnimationFrame(() => {
        checkStatus('enter')
        setData({
          inited: true,
          classes: classNames["enter-to"],
          currentDuration,
          display: true
        })
        transitionEnded.current = false;
        setTimeout(() => onTransitionEnd(), currentDuration);
        // setDisplay(true)
      })
    })
  }, [checkStatus, duration, getClassNames, name, onBeforeEnter, onEnter, onTransitionEnd])

  const Leave = usePersistFn(() => {
    if (!display) {
      return;
    }

    const classNames = getClassNames(name!);
    const currentDuration = isObj(duration) ? duration.leave : duration;
    status.current = "leave";
    onBeforeLeave && onBeforeLeave();
    requestAnimationFrame(() => {
      checkStatus('leave');
      onLeave && onLeave();

      setData({
        inited: true,
        classes: classNames.leave,
        currentDuration,
        display: true,
      })
      // setDisplay(true)

      requestAnimationFrame(() => {
        checkStatus('leave')
        setData({
          inited: true,
          classes: classNames["leave-to"],
          currentDuration,
          display: true
        })
        transitionEnded.current = false;
        setTimeout(() => onTransitionEnd(), currentDuration);
        // setDisplay(true)
      })
    })
  }, [checkStatus, display, duration, getClassNames, name, onBeforeLeave, onLeave, onTransitionEnd])

  useEffect(() => {
    if (props.show) {
      // enter
      Enter()
    } else {
      // leave
      Leave()
    }
    // }, [show, Enter, Leave]) // TODO : 因为不能因为Enter来响应更新，所以这里所有逻辑都要重写。。
  }, [Enter, Leave, props.show, show])

  return {
    data,
    show,
    duration,
    name,
    onTransitionEnd
  }
}

export const MixinsTransitionExternalClass = [
  'enter-class',
  'enter-active-class',
  'enter-to-class',
  'leave-class',
  'leave-active-class',
  'leave-to-class'
]


export const MixinsTransitionDefaultProps = {
  duration: 300,
  name: 'fade'
} as const
