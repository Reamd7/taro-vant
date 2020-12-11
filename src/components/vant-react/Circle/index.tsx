import Taro from "@tarojs/taro";
const { useMemo, useCallback, useEffect, useRef } = Taro /** api **/;
import "./index.less";
import { View, CoverView, Canvas } from "@tarojs/components";
import { ActiveProps, useScopeRef, isH5, isWeapp, getSystemInfoSync } from "../common/utils";
import { WHITE, BLUE } from "../common/color";
import { adaptor } from "./utils";
import usePersistFn from "src/common/hooks/usePersistFn";

export type VanCircleProps = {
  text?: string;
  lineCap?: "round" | "butt" | "square";
  value?: number;
  speed?: number;
  size?: number;
  fill?: string;
  layerColor?: string;
  color?: string | Record<string, string>;
  type?: '2d';
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
  type: '2d',
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
  const { text, type, size,
    strokeWidth, lineCap, clockwise,
    layerColor, fill,
    color,
    value, speed } = props
  const style = useMemo(() => ({
    width: size + "px", height: size + "px"
  }), [size])

  const canvasId = useMemo(() => `VanCircle_${Math.random().toString().split(".")[1]}`, []);

  const [scope, scopeRef] = useScopeRef();
  const contextRef = useRef<null | Taro.CanvasContext>(null)
  const getContext = useCallback(async () => {
    if (contextRef.current) return contextRef.current
    if (!scope) return null;
    if (isH5) {
      const canVasNode = (scope._rendered.dom as HTMLElement).querySelector("canvas");
      if (canVasNode) {
        const ctx = canVasNode.getContext(type || "2d");
        if (ctx) {
          return contextRef.current = adaptor(ctx);
        } else {
          return contextRef.current = null;
        }
      } else {
        return contextRef.current = null;
      }
    }
    if (isWeapp) {
      const dpr = getSystemInfoSync().pixelRatio;
      const query = Taro.createSelectorQuery().in(scope)
      return new Promise<Taro.CanvasContext>(resolve => {
        query.select('#' + canvasId)
          .fields({ node: true, size: true })
          .exec((res) => {
            const canvas = res[0].node
            const ctx = canvas.getContext('2d')

              canvas.width = size * dpr;
              canvas.height = size * dpr;
              ctx.scale(dpr, dpr);

            resolve(contextRef.current = adaptor(ctx))
          })
      })

    }
    const ctx = Taro.createCanvasContext(canvasId, scope);
    return contextRef.current = ctx;
  }, [type, size, scope])

  const GetHoverColor = useCallback(async (context: my.ICanvasContext) => {
    if (typeof color === "object") {
      const LinearColor = context.createLinearGradient(size, 0, 0, 0);
      Object.keys(color)
        .sort((a, b) => parseFloat(a) - parseFloat(b))
        .map((key) =>
          LinearColor.addColorStop(parseFloat(key) / 100, color[key])
        );
      return LinearColor;
    } else {
      return color
    }
  }, [color, getContext]);

  const presetCanvas = useCallback((context: my.ICanvasContext, strokeStyle: string | Taro.CanvasGradient, beginAngle: number, endAngle: number, fill?: string | Taro.CanvasGradient) => {
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
  const renderBackgroundCircle = useCallback((context: my.ICanvasContext) => {
    presetCanvas(context, layerColor, 0, PERIMETER, fill);
  }, [layerColor, fill, presetCanvas])
  /**
   * 渲染前景圆圈
   */
  const renderForegroundCircle = useCallback((context: my.ICanvasContext, hoverColor: string | my.ILinearGradient, formatValue: number) => {
    // 结束角度
    const progress = PERIMETER * (formatValue / 100);
    const endAngle = clockwise
      ? BEGIN_ANGLE + progress
      : 3 * Math.PI - (BEGIN_ANGLE + progress);

    presetCanvas(context, hoverColor, BEGIN_ANGLE, endAngle);
  }, [clockwise, presetCanvas]);

  const drawCircle = useCallback(async (currentValue: number) => {
    const context = await getContext();
    if (!context) return;
    context.clearRect(0, 0, size, size);
    renderBackgroundCircle(context);
    const formatValue = format(currentValue);
    if (formatValue !== 0) {
      renderForegroundCircle(context, await GetHoverColor(context), formatValue);
    }
    context.draw();
  }, [size, getContext, GetHoverColor, renderBackgroundCircle, renderForegroundCircle])

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

  useEffect(() => {
    reRender(value)
  }, [value])

  useEffect(() => {
    if (scope) {
      drawCircle(currentValue.current);
    }
  }, [scope])
  useEffect(() => {
    return function () {
      __clearInterval()
    }
  }, [])

  return <View className="van-circle" ref={scopeRef} style={style}>
    <Canvas className="van-circle__canvas" type={type || "2d"} style={style} id={canvasId} canvasId={canvasId}></Canvas>
    {(isH5 || isWeapp) ?
      text ? <View className="van-circle__text" style={style}>{text}</View> :
        <View className="van-circle__text" style={style}>
          {props.children}
        </View>

      : text ?
        <CoverView className="van-circle__text" style={style}>{text}</CoverView> :
        <CoverView className="van-circle__text" style={style}>
          {props.children}
        </CoverView>
    }
  </View>
}
VanCircle.defaultProps = DefaultProps;
VanCircle.options = {
  addGlobalClass: true
}
export default VanCircle;
