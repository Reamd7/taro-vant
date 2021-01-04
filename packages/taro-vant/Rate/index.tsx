import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
const { useMemo, useCallback, useRef, useEffect } = Taro /** api **/;
import { getAllRect, isExternalClass, isNormalClass, useMemoAddUnit, useMemoClassNames, CssProperties, ActiveProps, useScopeRef } from '../utils';
import VanIcon from '../icon';

import "./index.less";
import useControllableValue, { ControllerValueProps } from '../hooks/useControllableValue'
import usePersistFn from '../hooks/usePersistFn'

export type VanRateProps = {
  className?: string;
  ['custom-class']?: string;
  ['icon-class']?: string;
  iconClass?: string;

  size?: number;
  readonly?: boolean;
  disabled?: boolean;
  allowHalf?: boolean;
  icon?: React.ComponentProps<typeof VanIcon>['name']
  voidIcon?: React.ComponentProps<typeof VanIcon>['name']
  color?: string;
  voidColor?: string;
  disabledColor?: string;
  count?: number;
  gutter?: number;
  touchable?: boolean;

} & ControllerValueProps<number>

const DefaultProps = {
  readonly: false,
  disabled: false,
  allowHalf: false,
  size: 20,
  icon: 'star',
  voidIcon: 'star-o',
  color: '#ffd21e',
  voidColor: '#c7c7c7',
  disabledColor: '#bdbdbd',
  count: 5,
  gutter: 4,
  touchable: true,
  defaultValue: 0
}


type ActiveVanRateProps = ActiveProps<VanRateProps, keyof typeof DefaultProps>

const VanRate: Taro.FunctionComponent<VanRateProps> = (props: ActiveVanRateProps) => {
  const {
    readonly,
    disabled,
    allowHalf,
    size,
    icon,
    voidIcon,
    color,
    voidColor,
    disabledColor,
    count,
    gutter,
    touchable,
  } = props;
  const [Value, setValue] = useControllableValue(props, {
    defaultValue: 0
  })

  const innerCountArray = useMemo(() => Array.from({ length: count }).map((_, index) => index), [count]);
  const classnames = useMemoClassNames();
  const [scope, ref] = useScopeRef();
  const css = CssProperties;
  const addUnit = useMemoAddUnit();
  // const bem = useMemoBem();
  const onSelect = useCallback((score: number | string) => {
    if (!disabled && !readonly) {
      setValue(Number(score))
    }
  }, [setValue, disabled, readonly])

  const __list__ = useRef<Taro.NodesRef.BoundingClientRectCallbackResult[]>([])

  const getStar = usePersistFn((cb?: (data: Taro.NodesRef.BoundingClientRectCallbackResult[]) => void)=>{
    if (__list__.current.length) {
      cb && cb(__list__.current)
    }
    const selector = allowHalf ? '.van-rate__half' : '.van-rate__icon';
    getAllRect(scope, selector).then(list => {
      list = list.sort((a, b) => a.right - b.right)
      // .filter((v, i, arr) => {
      //   let nextV = arr[i + 1];
      //   if (nextV) {
      //     if (nextV.left === v.left && nextV.right === v.right) {
      //       return false
      //     } else {
      //       return true
      //     }
      //   } else {
      //     return true
      //   }
      // });
      if (list.length) {
        list.unshift({
          left: 0,
          right: list[0].left,
          bottom: list[0].bottom,
          top: list[0].top,
          width: list[0].width,
          height: list[0].height,
          id: "",
          dataset: {
            score: 0
          }
        })
      }
      __list__.current = list;
      cb && cb(__list__.current);
    })
  }, [scope, allowHalf, count])

  useEffect(() => {
    getStar()
  }, [scope, allowHalf, count, gutter]);

  return <View
    className={classnames(
      'van-rate',
      isExternalClass && 'custom-class',
      isNormalClass && props.className
    )}
    ref={ref}
    onTouchMove={(event) => {
      if (!touchable || readonly || disabled) return;
      const { clientX } = event.touches[0];
      getStar(list => {
        // console.log(list);
        const index = list.findIndex((item, index, arr) => {
          if (index === 0) {
            return clientX <= item.right
          }
          if (index === count) {
            return clientX <= item.left
          }
          const prev = arr[index - 1];
          return clientX >= prev.left && clientX <= item.right
        });
        if (index != -1) {
          // const target = list[index];
          const score = allowHalf ? index / 2 : index;
          // console.log(index, target, clientX)
          // onSelect(target.dataset ? target.dataset.score : score)
          onSelect(score)
        } else {
          onSelect(count)
        }
      })
    }}
  >
    {innerCountArray.map((val, index) => {
      return <View
        key={val}
        className="van-rate__item"
        style={css({
          paddingRight: index !== count - 1 ? addUnit(
            gutter
          ) : undefined
        })}
      >
        {allowHalf ? <View className="van-rate__icon" style={css({
          width: addUnit(size),
          height: addUnit(size),
          fontSize: addUnit(size)
        })}>
          <View className="van-rate__half van-rate__icon--left" data-score={index + 0.5} onClick={() => onSelect(index + 0.5)}>
            <VanIcon
              name={index + 0.5 <= Value ? icon : voidIcon}
              className={classnames(
                isNormalClass && props.iconClass,
                isExternalClass && 'icon-class',
              )}
              custom-class={classnames(
                isNormalClass && props.iconClass,
                isExternalClass && 'icon-class',
              )}
              data-score={index + 0.5}
              color={disabled ? disabledColor : index + 0.5 <= Value ? color : voidColor}
              // onClick={()=> onSelect(index + 0.5)}
              size={size}
            />
          </View>
          <View className="van-rate__half van-rate__icon--right" data-score={index + 1} onClick={() => onSelect(index + 1)}>
            <VanIcon
              name={index + 1 <= Value ? icon : voidIcon}
              className={classnames(
                isNormalClass && props.iconClass,
                isExternalClass && 'icon-class',
              )}
              custom-class={classnames(
                isNormalClass && props.iconClass,
                isExternalClass && 'icon-class',
              )}
              data-score={index + 1}
              color={disabled ? disabledColor : index + 1 <= Value ? color : voidColor}
              // onClick={()=> onSelect(index + 1)}
              size={size}
            />
          </View>
        </View> :
          <View className="van-rate__icon" data-score={index + 1} style={{
            width: addUnit(size),
            height: addUnit(size)
          }} onClick={() => onSelect(index + 1)}>
            <VanIcon
              name={index + 1 <= Value ? icon : voidIcon}
              className={classnames(
                isNormalClass && props.iconClass,
                isExternalClass && 'icon-class',
              )}
              custom-class={classnames(
                isNormalClass && props.iconClass,
                isExternalClass && 'icon-class',
              )}
              color={disabled ? disabledColor : index + 1 <= Value ? color : voidColor}
              size={size}
              data-score={index + 1}
            // onClick={()=> onSelect(index + 1)}
            />
          </View>}
      </View>
    })}
  </View>
};

VanRate.options = {
  addGlobalClass: true
};

VanRate.externalClasses = [
  'custom-class',
  'icon-class'
];
VanRate.defaultProps = DefaultProps;
export default VanRate
