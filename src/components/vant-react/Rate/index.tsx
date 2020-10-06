import { View } from '@tarojs/components';
import { ITouchEvent } from '@tarojs/components/types/common';
import Taro, { useMemo,  useCallback } from '@tarojs/taro';
import { FormField, useFormItem } from '../common/formitem';
import { useScope, getAllRect, isH5, isWeapp, useMemoAddUnit, useMemoClassNames, useMemoCssProperties } from '../common/utils';
import VanIcon from '../icon';

import "./index.less";


export type VanRateProps<T extends string> = {
  className?: string;
  ['custom-class']?: string;
  ['icon-class']?: string;
  iconClass?: string;

  size?: number;
  // defaultValue?: number; // 默认值
  // value?: number; // 受控组件
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

  // onInput?: (val: number) => void;
  // onChange?: (val: number) => void;

} & FormField<T, number>

const VanRate = function <T extends string>(props: VanRateProps<T>) {
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
    touchable = true,

    defaultValue = 0,
    FormData,
    fieldName,
    value
  } = props;
  // 这个就有一个问题，需要这样使用表单组件，因为，需要定义当defaultValue 和 Value 都是 undefined 的情况下的值。所以这样是合理滴。就算初次 defaultValue 不是 undefined，那之后是不是undefined，要如何处理
  const [innerValue, setInnerValue] = useFormItem({
    fieldName,
    FormData,
    defaultValue, // 受控组件
    value,        // 非受控组件
  });

  const innerCountArray = useMemo(() => Array.from({ length: count }).map((_, index) => index), [count]);
  const classnames = useMemoClassNames();
  const scope = useScope();
  const css = useMemoCssProperties();
  const addUnit = useMemoAddUnit();
  // const bem = useMemoBem();
  const onSelect = useCallback((event: ITouchEvent) => {
    const { score } = event.currentTarget.dataset;

    if (!disabled && !readonly) {
      setInnerValue(Number(score) + 1);

      Taro.nextTick(() => {
        props.onChange && props.onChange(Number(score) + 1);
      })
    }
  }, [props.onChange, setInnerValue, disabled, readonly])
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
        {allowHalf ? <View className="van-rate__icon" style={css({
          width: addUnit(size),
          height: addUnit(size),
          fontSize: addUnit(size)
        })}>
          <View className="van-rate__half van-rate__icon--left" data-score={index - 0.5}  onClick={onSelect}>
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
              // data-score={index - 0.5}
              color={disabled ? disabledColor : index + 0.5 <= innerValue ? color : voidColor}
              // onClick={onSelect}
              size={size}
            />
          </View>
          <View className="van-rate__half van-rate__icon--right" data-score={index} onClick={onSelect}>
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
              // data-score={index}
              color={disabled ? disabledColor : index + 1 <= innerValue ? color : voidColor}
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
              color={disabled ? disabledColor : index + 1 <= innerValue ? color : voidColor}
              size={size}
            />
          </View>}
      </View>
    })}
  </View>
};

(VanRate as Taro.FunctionComponent<any>).options = {
  addGlobalClass: true
};

(VanRate as Taro.FunctionComponent<any>).externalClasses = [
  'custom-class',
  'icon-class'
];

(VanRate as any).behaviors = ['wx://form-field'];

export default VanRate