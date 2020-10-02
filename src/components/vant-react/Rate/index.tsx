import { View } from '@tarojs/components';
import { ITouchEvent } from '@tarojs/components/types/common';
import Taro, { useMemo, useScope, useState, useCallback } from '@tarojs/taro';
import { getAllRect, isH5, isWeapp, useMemoAddUnit, useMemoBem, useMemoClassNames, useMemoCssProperties } from '../common/utils';
import VanIcon from '../icon';

import "./index.less";

export type VanRateProps = {
  className?: string;
  ['custom-class']?: string;
  ['icon-class']?: string;
  iconClass?: string;

  size?: number;
  value?: number;
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

  onInput?: (val: number) => void;
  onChange?: (val: number) => void;
}

const VanRate: Taro.FunctionComponent<VanRateProps> = (props) => {
  const {
    readonly,
    disabled,
    allowHalf,
    size = 20,
    icon = "star",
    voidIcon = 'star-o',
    color = '#ffd21e',
    voidColor = '#c7c7c7',
    disabledColor = '#bdbdbd',
    count = 5,
    gutter = 4,
    touchable = true
  } = props;
  const [innerValue, setInnerValue] = useState(props.value || 0);
  const innerCountArray = useMemo(() => Array.from({ length: count }).map((_, index) => index), [count]);
  // useEffect(() => {
  //   props.value != null && setInnerValue(props.value);
  // }, [props.value])
  const classnames = useMemoClassNames();
  const scope = useScope();
  const css = useMemoCssProperties();
  const addUnit = useMemoAddUnit();
  const bem = useMemoBem();
  const onSelect = useCallback((event: ITouchEvent) => {

    const { score } = event.currentTarget.dataset;
    if (!disabled && !readonly) {
      setInnerValue(score + 1);

      Taro.nextTick(() => {
        props.onChange && props.onChange(score + 1);
        props.onInput && props.onInput(score + 1);
      })
    }
  }, [props.onInput, props.onChange, disabled, readonly])
  return <View
    className={classnames(
      'van-rate',
      isWeapp && 'custom-class',
      isH5 && props.className
    )}
    onTouchMove={(event) => {
      if (!touchable) return;
      const { clientX } = event.touches[0];

      if (allowHalf) {
        getAllRect(scope, '.van-rate__half').then(list => {
          const target = list
            .sort((item) => item.right - item.left)
            .find((item) => clientX >= item.left && clientX <= item.right);
          if (target != null) {
            onSelect({
              ...event,
              currentTarget: {
                ...target,
                tagName: "van-icon"
              }
            })
          }
        })
      } else {
        getAllRect(scope, '.van-rate__icon').then(list => {
          const target = list
            .sort((item) => item.right - item.left)
            .find((item) => clientX >= item.left && clientX <= item.right);
          if (target != null) {
            onSelect({
              ...event,
              currentTarget: {
                ...target,
                tagName: "van-icon"
              }
            })
          }
        })
      }
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
        {allowHalf ? <View className="van-rate__icon" style={{
          width: addUnit(size),
          height: addUnit(size),
          fontSize: addUnit(size)
        }}>
          <View className="van-rate__half van-rate__icon--left" data-score={index - 0.5}>
            <VanIcon
              name={index + 0.5 <= innerValue ? icon : voidIcon}
              className={classnames(
                isH5 && props.iconClass,
                isWeapp && 'icon-class',
              )}
              custom-class={classnames(
                isH5 && props.iconClass,
                isWeapp && 'icon-class',
              )}
              data-score={index - 0.5}
              color={disabled ? disabledColor : index + 0.5 <= innerValue ? color : voidColor}
              onClick={onSelect}
              size={size}
            />
          </View>
          <View className="van-rate__half van-rate__icon--right" data-score={index}>
            <VanIcon
              name={index + 1 <= innerValue ? icon : voidIcon}
              className={classnames(
                isH5 && props.iconClass,
                isWeapp && 'icon-class',
              )}
              custom-class={classnames(
                isH5 && props.iconClass,
                isWeapp && 'icon-class',
              )}
              data-score={index}
              color={disabled ? disabledColor : index + 1 <= innerValue ? color : voidColor}
              onClick={onSelect}
              size={size}
            />
          </View>
        </View> :
          <View className="van-rate__icon" data-score={index} style={{
            width: addUnit(size),
            height: addUnit(size)
          }}>
            <VanIcon
              name={index + 1 <= innerValue ? icon : voidIcon}
              className={classnames(
                "van-rate__icon",
                isH5 && props.iconClass,
                isWeapp && 'icon-class',
              )}
              custom-class={classnames(
                "van-rate__icon",
                isH5 && props.iconClass,
                isWeapp && 'icon-class',
              )}
              data-score={index}
              color={disabled ? disabledColor : index + 1 <= innerValue ? color : voidColor}
              onClick={onSelect}
              size={size}
            />
          </View>}
      </View>
    })}
  </View>
}

VanRate.options = {
  addGlobalClass: true
}

VanRate.externalClasses = [
  'custom-class',
  'icon-class'
];
(VanRate as any).behaviors = ['wx://form-field'];

export default VanRate
