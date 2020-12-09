import { View } from '@tarojs/components';
import { ITouchEvent } from '@tarojs/components/types/common';
import Taro from '@tarojs/taro';
const { useMemo, useCallback } = Taro /** api **/;
import { useScope, getAllRect, isExternalClass, isNormalClass, useMemoAddUnit, useMemoClassNames, useMemoCssProperties, ActiveProps } from '../common/utils';
import VanIcon from '../icon';

import "./index.less";
import useControllableValue, { ControllerValueProps } from 'src/common/hooks/useControllableValue';

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
  const scope = useScope();
  const css = useMemoCssProperties();
  const addUnit = useMemoAddUnit();
  // const bem = useMemoBem();
  const onSelect = useCallback((event: ITouchEvent) => {
    const { score } = event.currentTarget.dataset;
    if (!disabled && !readonly) {
      setValue(Number(score) + 1)
    }
  }, [setValue, disabled, readonly])
  return <View
    className={classnames(
      'van-rate',
      isExternalClass && 'custom-class',
      isNormalClass && props.className
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
        {allowHalf ? <View className="van-rate__icon" style={css({
          width: addUnit(size),
          height: addUnit(size),
          fontSize: addUnit(size)
        })}>
          <View className="van-rate__half van-rate__icon--left" data-score={index - 0.5} onClick={onSelect}>
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
              // data-score={index - 0.5}
              color={disabled ? disabledColor : index + 0.5 <= Value ? color : voidColor}
              // onClick={onSelect}
              size={size}
            />
          </View>
          <View className="van-rate__half van-rate__icon--right" data-score={index} onClick={onSelect}>
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
              // data-score={index}
              color={disabled ? disabledColor : index + 1 <= Value ? color : voidColor}
              // onClick={onSelect}
              size={size}
            />
          </View>
        </View> :
          <View className="van-rate__icon" data-score={index} style={{
            width: addUnit(size),
            height: addUnit(size)
          }} onClick={onSelect}>
            <VanIcon
              name={index + 1 <= Value ? icon : voidIcon}
              className={classnames(
                "van-rate__icon",
                isNormalClass && props.iconClass,
                isExternalClass && 'icon-class',
              )}
              custom-class={classnames(
                "van-rate__icon",
                isNormalClass && props.iconClass,
                isExternalClass && 'icon-class',
              )}
              color={disabled ? disabledColor : index + 1 <= Value ? color : voidColor}
              size={size}
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
