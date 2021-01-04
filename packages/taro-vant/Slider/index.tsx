import Taro from "@tarojs/taro";
const { useMemo, useCallback, useState, useEffect, useRef } = Taro /** api **/;
import "./index.less";
import { useMemoClassNames, bem, isExternalClass, isNormalClass, CssProperties, useMemoAddUnit, getRect, nextTick, ActiveProps, useScopeRef } from "../utils"
import { View } from "@tarojs/components";
import useControllableValue, { ControllerValueProps } from "../hooks/useControllableValue";
import { useTouch } from "../common/mixins/touch";
import { ITouchEvent } from "@tarojs/components/types/common";
import usePersistFn from "../hooks/usePersistFn"

export type VanSliderProps = {
  disabled?: boolean
  useButtonSlot?: boolean
  activeColor?: string
  inactiveColor?: string;
  max?: number;
  min?: number;
  step?: number;
  barHeight?: number;

  className?: string;
  'custom-class'?: string;

  renderButton?: React.ReactNode;

  onDragStart?: VoidFunction;
  onDragEnd?: VoidFunction;
  onDrag?: (val: number) => void;


} & ControllerValueProps<number>

const DefaultProps = {
  max: 100,
  min: 0,
  step: 1,
  barHeight: 2,
  disabled: false,
  useButtonSlot: false,
  activeColor: "#1989fa",
  inactiveColor: "#e5e5e5",
} as const

type ActiveVanSliderProps = ActiveProps<VanSliderProps, keyof typeof DefaultProps>

const VanSlider: Taro.FunctionComponent<VanSliderProps> = (props: ActiveVanSliderProps) => {
  const css = CssProperties;

  const addUnit = useMemoAddUnit();
  const classname = useMemoClassNames();

  const [value, setValue] = useControllableValue(props, {
    defaultValue: 0
  })
  const [dragValue, setDragValue] = useState(value);

  useEffect(() => setDragValue(value), [value]);

  const { touchRef, touchStart, touchMove } = useTouch();
  const [dragStatus, setdragStatus] = useState('drag-end');

  const getRange = useMemo(() => props.max - props.min, [props.min, props.max]);
  const format = useCallback((value: number) => {
    const max = props.max;
    const min = props.min;
    const step = props.step;
    return Math.round(Math.max(min, Math.min(value, max)) / step) * step;
  }, [props.max, props.min, props.step]);


  // const setDragValueThrottleFn = useThrottleFn(setDragValue, {
  //   delay: 1000 / 60
  // });


  // const barStyle = useMemo(() => {

  //   const width = `${((dragValue - props.min) * 100) / getRange}%`;
  //   const style: React.CSSProperties = {
  //     width,
  //     height: addUnit(props.barHeight),
  //     background: props.activeColor
  //   }

  //   if (dragStatus !== 'drag-end') {
  //     style.transition = "none"
  //   }
  //   return style
  // }, [props.min, getRange, dragValue, dragStatus, props.barHeight, addUnit, props.activeColor]);

  const [scope, ref] = useScopeRef();

  const refW = useRef<Taro.NodesRef.BoundingClientRectCallbackResult>()
  const getRectContainer = usePersistFn((
    cb: (rect: Taro.NodesRef.BoundingClientRectCallbackResult) => void
  ) => {
    if (!refW.current) {
      getRect(scope, '.van-slider').then(rect => {
        cb(
          refW.current = rect
        )
      })
    } else {
      cb(
        refW.current
      )
    }
  }, [scope])

  const onClick = useCallback((event) => {
    if (props.disabled) return;

    getRectContainer((rect) => {
      const newValue = format(
        ((event.detail.x - rect.left) / rect.width) * getRange + props.min
      );
      setValue(newValue);
    })

  }, [props.disabled, scope, getRange, props.min, setDragValue, format])

  const onTouchStart = useCallback((e: ITouchEvent) => {
    e.preventDefault()
    if (props.disabled) return;
    touchStart.current(e)
    setdragStatus('start')
  }, [props.disabled, touchStart, setdragStatus])

  const onTouchEnd = useCallback(() => {
    if (props.disabled) return;

    if (dragStatus === 'draging') {
      const newValue = format(dragValue);
      setValue(newValue);
      props.onDragEnd && props.onDragEnd()
      setdragStatus('drag-end')
    }
  }, [props.disabled, dragStatus, format, dragValue, props.onDragEnd, setdragStatus])


  return <View ref={ref}><View
    className={classname(
      isNormalClass && props.className,
      isExternalClass && 'custom-class',
      bem('slider', { disabled: props.disabled })
    )}
    style={css({
      background: props.inactiveColor
    })}
    onClick={onClick}
  >
    <View
      className="van-slider__bar"
      style={(() => {
        const width = `${((dragValue - props.min) * 100) / getRange}%`;
        const style: React.CSSProperties = {
          width,
          height: addUnit(props.barHeight),
          background: props.activeColor
        }

        if (dragStatus !== 'drag-end') {
          style.transition = "none"
        }
        return style
      })()}
    >
      <View
        className="van-slider__button-wrapper"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        onTouchMove={e => {
          e.stopPropagation()

          if (props.disabled) return;


          if (dragStatus === 'start') {
            props.onDragStart && props.onDragStart()
          }
          touchMove.current(e);
          if (dragStatus !== 'draging') {
            setdragStatus('draging')
          }

          getRectContainer((rect) => {
            const diff = (touchRef.current.deltaX / rect.width) * 100;
            const newValue = format(value + diff);

            // =========================================
            props.onDrag && props.onDrag(newValue);

            // setDragValueThrottleFn.run(newValue)
            nextTick(()=>{
              setDragValue(newValue);
            })
          })
        }}
      >
        {props.useButtonSlot ? props.renderButton : <View
          className="van-slider__button"
        />}
      </View>
    </View>
  </View></View>
}

VanSlider.options = {
  addGlobalClass: true
}

VanSlider.externalClasses = [
  'custom-class'
]
VanSlider.defaultProps = DefaultProps;

export default VanSlider;
