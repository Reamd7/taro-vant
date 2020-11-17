import Taro, { useMemo, useCallback, useEffect, useRef } from "@tarojs/taro";

import "./index.less";
import { View, CoverView, Canvas } from "@tarojs/components";
import { useMemoAddUnit, getSystemInfoSync, ActiveProps, useScope } from "../common/utils";
import { WHITE, BLUE } from "../common/color";
import { adaptor } from "./utils";
import usePersistFn from "src/common/hooks/usePersistFn";
import useUpdateEffect from "src/common/hooks/useUpdateEffect";

export type VanCircleProps = {
  text?: string;
  lineCap?: "round" | "butt" | "square";
  value?: number;
  speed?: number;
  size?: number;
  fill?: string;
  layerColor?: string;
  color?: string | Record<string, string>;
  type?: '2d' | '';
  strokeWidth?: number;
  clockwise?: boolean;

  children?: React.ReactNode;
}

const DefaultProps = {
  lineCap: 'round',
  value: 0,
  speed: 50,
  size: 100,
  layerColor: WHITE,
  color: BLUE,
  type: '',
  strokeWidth: 4,
  clockwise: true,
} as const


type ActiveVanCircleProps = ActiveProps<VanCircleProps, keyof typeof DefaultProps>

const format = (rate: number) => {
  return Math.min(Math.max(rate, 0), 100);
}
const PERIMETER = 2 * Math.PI;
const BEGIN_ANGLE = -Math.PI / 2;
const STEP = 1;

const VanCircle: Taro.FunctionComponent<VanCircleProps> = (props: ActiveVanCircleProps) => {
  const inited = useRef(false)
  const { text, type, size,
    strokeWidth, lineCap, clockwise,
    layerColor, fill,
    color,
    value, speed } = props
  const addUnit = useMemoAddUnit();
  const asize = addUnit(size);
  const style = useMemo(() => ({
    width: asize, height: asize
  }), [size])

  const scope = useScope();
  const getContext = useCallback(() => {
    if (!scope) return Promise.resolve<null | Taro.CanvasContext>(null);
    if (type === '') {
      const ctx = Taro.createCanvasContext('van-circle', scope);
      return Promise.resolve(ctx);
    }

    const dpr = getSystemInfoSync().pixelRatio;

    return new Promise<Taro.CanvasContext>(resolve => {
      Taro.createSelectorQuery()
        .in(scope)
        .select('#van-circle')
        .node(function (res: {
          node: Taro.Canvas & WechatMiniprogram.Canvas
        }) {
          const canvas = res.node;
          const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
          // type === "2d" ? canvas.getContext("2d") as CanvasRenderingContext2D :
          //   type === "webgl" ? canvas.getContext("webgl") as WebGLRenderingContext : null
          // ;

          if (!inited.current) {
            inited.current = true;
            canvas.width = size * dpr;
            canvas.height = size * dpr;
            ctx.scale(dpr, dpr);
          }
          resolve(adaptor(ctx))
        })
        .exec()
    })
  }, [type, size, scope])

  const hoverColor = useRef<string | Taro.CanvasGradient>(BLUE);
  const setHoverColor = usePersistFn(() => {
    if (typeof color === "object") {
      return getContext().then(context => {
        if (!context) return undefined;
        const LinearColor = context.createLinearGradient(size, 0, 0, 0);
        Object.keys(color)
          .sort((a, b) => parseFloat(a) - parseFloat(b))
          .map((key) =>
            LinearColor.addColorStop(parseFloat(key) / 100, color[key])
          );
        hoverColor.current = (LinearColor)
        return LinearColor;
      })
    }
    hoverColor.current = (color)
    return Promise.resolve<string | Taro.CanvasGradient | undefined>(color);
  }, [color, size, getContext]);


  const presetCanvas = useCallback((context: Taro.CanvasContext, strokeStyle: string | Taro.CanvasGradient, beginAngle: number, endAngle: number, fill?: string | Taro.CanvasGradient) => {
    const position = size / 2;
    const radius = position - strokeWidth / 2;
    context.setStrokeStyle(strokeStyle)
    context.setLineWidth(strokeWidth);
    context.setLineCap(lineCap);

    context.beginPath();
    context.arc(position, position, radius, beginAngle, endAngle, !clockwise);
    context.stroke();

    if (fill) {
      context.setFillStyle(fill);
      context.fill();
    }
  }, [strokeWidth, lineCap, clockwise, size]);
  /**
   * 渲染背景圆圈
   */
  const renderBackgroundCircle = useCallback((context: Taro.CanvasContext) => {
    presetCanvas(context, layerColor, 0, PERIMETER, fill);
  }, [layerColor, fill, presetCanvas])
  /**
   * 渲染前景圆圈
   */
  const renderForegroundCircle = useCallback((context: Taro.CanvasContext, formatValue: number) => {
    // 结束角度
    const progress = PERIMETER * (formatValue / 100);
    const endAngle = clockwise
      ? BEGIN_ANGLE + progress
      : 3 * Math.PI - (BEGIN_ANGLE + progress);

    presetCanvas(context, hoverColor.current, BEGIN_ANGLE, endAngle);
  }, [clockwise, presetCanvas, hoverColor]);

  const drawCircle = usePersistFn((currentValue: number) => {
    getContext().then((context) => {
      if (!context) return;
      context.clearRect(0, 0, size, size);

      renderBackgroundCircle(context);

      const formatValue = format(currentValue);
      if (formatValue !== 0) {
        renderForegroundCircle(context, formatValue);
      }
      context.draw();
    });
  }, [size, getContext, renderBackgroundCircle, renderForegroundCircle])

  const interval = useRef<number>();
  const currentValue = useRef(value);

  const __clearInterval = useCallback(() => {
    if (interval.current !== undefined) {
      clearInterval(interval.current)
      interval.current = undefined;
    }
  }, [])


  // =============================================================
  const reRender = usePersistFn((value: number) => {

    if (speed <= 0 || speed > 1000) {
      drawCircle(value);
      return;
    }
    __clearInterval();
    currentValue.current = currentValue.current || 0;
    interval.current = setInterval(() => {
      if (currentValue.current !== value) {
        if (currentValue.current < value) {
          currentValue.current += STEP
          drawCircle(currentValue.current)
        } else {
          currentValue.current -= STEP
          drawCircle(currentValue.current)
        }
      } else {
        __clearInterval()
      }
    }, 1000 / speed)
  }, [speed, __clearInterval, currentValue])

  useUpdateEffect(() => {
    reRender(value)
  }, [value])

  useEffect(() => {
    setHoverColor().then(() => {
      drawCircle(currentValue.current);
    })
  }, [color])
  useEffect(() => {
    return function () {
      __clearInterval()
    }
  }, [])

  return <View className="van-circle">
    <Canvas className="van-circle__canvas" type={type} style={style} id="van-circle" canvas-id="van-circle"></Canvas>
    {text ?
      <CoverView className="van-circle__text">{text}</CoverView> :
      <View className="van-circle__text">
        {props.children}
      </View>}
  </View>
}
VanCircle.defaultProps = DefaultProps;
VanCircle.options = {
  addGlobalClass: true
}
export default VanCircle;
