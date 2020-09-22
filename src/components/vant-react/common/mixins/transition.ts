import { requestAnimationFrame } from "../utils";
import { useState, useEffect, useRef, useCallback } from "@tarojs/taro";
export type MixinsTransitionProps = {
    style?: React.CSSProperties;
    show?: boolean;
    duration?: number | {
        enter: number;
        leave: number;
    };
    name?: 'fade' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right'
} & {
    onBeforeEnter?: VoidFunction;
    onEnter?: VoidFunction;
    onAfterEnter?: VoidFunction;
    onBeforeLeave?: VoidFunction;
    onLeave?: VoidFunction;
    onAfterLeave?: VoidFunction;
} & {
    enterClass?: string;
    enterActiveClass?: string;
    enterToClass?: string;
    leaveClass?: string;
    leaveActiveClass?: string;
    leaveToClass?: string;
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

export function useMixinsTransition(props: MixinsTransitionProps, showDefaultValue: boolean) {
    const { show = showDefaultValue, duration = 300, name = 'fade' } = props;

    const status = useRef<'enter' | 'leave'>();
    const transitionEnded = useRef<boolean>();

    const checkStatus = useCallback((_status: 'enter' | 'leave') => {
        if (status.current !== _status) {
            throw new Error(`incongruent status: ${_status}`);
        }
    }, [])

    const getClassNames = useCallback((name: string) => {
        return {
            enter: `van-${name}-enter van-${name}-enter-active ${props.enterClass} ${props.enterActiveClass}`,
            'enter-to': `van-${name}-enter-to van-${name}-enter-active ${props.enterToClass} ${props.enterActiveClass}`,
            leave: `van-${name}-leave van-${name}-leave-active ${props.leaveClass} ${props.leaveActiveClass}`,
            'leave-to': `van-${name}-leave-to van-${name}-leave-active ${props.leaveToClass} ${props.leaveActiveClass}`,
        }
    }, [props.enterActiveClass, props.enterClass, props.enterToClass, props.leaveActiveClass, props.leaveClass, props.leaveToClass, name])

    const [data, setData] = useState({
        inited: false,
        display: false,
        // type: '',
        classes: '',
        currentDuration: 0
    })
    const onTransitionEnd = useCallback(() => {
        if (transitionEnded.current) {
            return;
        }
        transitionEnded.current = true;
        if (status.current === "enter") {
            props.onAfterEnter && props.onAfterEnter()
        } else if (status.current === "leave") {
            props.onAfterLeave && props.onAfterLeave()
        }

        const { display } = data;
        if (!show && display) {
            setData({
                ...data,
                display: false
            })
        }
    }, [data, show, props.onAfterEnter, props.onAfterLeave])

    const Enter = useCallback(() => {
        const classNames = getClassNames(name);
        const currentDuration = isObj(duration) ? duration.enter : duration;
        status.current = "enter";
        props.onBeforeEnter && props.onBeforeEnter();
        requestAnimationFrame(() => {
            checkStatus('enter');
            props.onEnter && props.onEnter();

            setData({
                inited: true,
                display: true,
                classes: classNames.enter,
                currentDuration
            })

            requestAnimationFrame(() => {
                checkStatus('enter')
                transitionEnded.current = false;
                setData({
                    inited: true,
                    display: true,
                    classes: classNames["enter-to"],
                    currentDuration
                })
            })
        })
    }, [duration, name, props.onBeforeEnter, props.onEnter, getClassNames])

    const Leave = useCallback(() => {
        if (!data.display) {
            return;
        }
        const classNames = getClassNames(name);
        const currentDuration = isObj(duration) ? duration.leave : duration;
        status.current = "leave";
        props.onBeforeLeave && props.onBeforeLeave();
        requestAnimationFrame(() => {
            checkStatus('leave');
            props.onLeave && props.onLeave();

            setData({
                inited: true,
                display: true,
                classes: classNames.leave,
                currentDuration
            })

            requestAnimationFrame(() => {
                checkStatus('leave')
                transitionEnded.current = false;
                setTimeout(() => onTransitionEnd(), currentDuration);
                setData({
                    inited: true,
                    display: true,
                    classes: classNames["leave-to"],
                    currentDuration
                })
            })
        })
    }, [data.display, duration, name, props.onBeforeLeave, props.onLeave, onTransitionEnd, getClassNames])

    useEffect(() => {
        if (show) {
            // enter
            Enter()
        } else {
            // leave
            Leave()
        }
        // }, [show, Enter, Leave]) // TODO : 因为不能因为Enter来响应更新，所以这里所有逻辑都要重写。。
    }, [show])


    return { data, onTransitionEnd }
}