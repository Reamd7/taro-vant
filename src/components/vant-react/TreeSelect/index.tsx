import Taro from "@tarojs/taro";
import "./index.less";
import VanIcon, { VanIconProps } from "../icon";
import { ActiveProps, noop, useMemoAddUnit, useMemoClassNames, useMemoBem, isExternalClass, isNormalClass } from "../common/utils";
import VanSidebarItem, { VanSidebarItemProps } from "../Sidebar/item";
import { View, ScrollView } from "@tarojs/components";
import useControllableValue, { ControllerValueProps } from "src/common/hooks/useControllableValue";
import VanSidebar from "../Sidebar";

export type VanTreeSelectProps = {
  items?: Array<{
    // 导航名称
    text: VanSidebarItemProps['title'],
    // 导航名称右上角徽标，1.5.0 版本开始支持
    info?: VanSidebarItemProps['info'],
    // 是否在导航名称右上角显示小红点，1.5.0 版本开始支持
    dot?: VanSidebarItemProps['dot'],
    // 禁用选项
    disabled?: VanSidebarItemProps['disabled'],
    // 该导航下所有的可选项
    children?: {
      // 名称
      text?: string,
      // id，作为匹配选中状态的标识
      id: number | string,
      // 禁用选项
      disabled?: boolean,
    }[],
  }>
  height?: number | string;

  max?: number;
  selectedIcon?: VanIconProps['name'];

  'custom-class'?: string;
  className?: string;
  'main-item-class'?: string;
  mainItemClass?: string;
  'content-item-class'?: string;
  contentItemClass?: string;
  'main-active-class'?: string;
  mainActiveClass?: string;
  'content-active-class'?: string;
  contentActiveClass?: string;
  'main-disabled-class'?: string;
  mainDisabledClass?: string;
  'content-disabled-class'?: string;
  contentDisabledClass?: string;

  // mainActiveIndex?: number;
  // onClickNav?: (index: number) => void;

  // activeId?: Array<number | string>;
  onClickItem?: (item: {
    // 名称
    text?: string,
    // id，作为匹配选中状态的标识
    id: number | string,
    // 禁用选项
    disabled?: boolean,
  }) => void;

  pid: string;
  renderContent?: React.ReactNode

} & ControllerValueProps<
  number,
  "defaultMainActiveIndex",
  "mainActiveIndex",
  "onClickNav"
> & ControllerValueProps<
  Array<number | string>,
  "defaultactiveId",
  "activeId",
  "onChange"
>
const DefaultProps = {
  items: [],
  height: 300,
  defaultMainActiveIndex: 0,
  defaultactiveId: [],
  max: Infinity,
  selectedIcon: "success",
  onClickNav: noop,
  onClickItem: noop
}
type ActiveVanTreeSelectProps = ActiveProps<VanTreeSelectProps, keyof typeof DefaultProps>

const VanTreeSelect: Taro.FunctionComponent<VanTreeSelectProps> = (props: ActiveVanTreeSelectProps) => {
  const addUnit = useMemoAddUnit();
  const classnames = useMemoClassNames();
  const bem = useMemoBem();

  const [mainActiveIndex, setmainActiveIndex] = useControllableValue(props, {
    defaultValue: 0,
    defaultValuePropName: "defaultMainActiveIndex",
    valuePropName: "mainActiveIndex",
    trigger: "onClickNav"
  });

  const [activeId, setactiveId] = useControllableValue(props, {
    defaultValue: [] as Array<number | string>,
    defaultValuePropName: "defaultactiveId",
    valuePropName: "activeId",
    trigger: "onChange"
  });

  const subItems = props.items[mainActiveIndex] ? props.items[mainActiveIndex].children || [] : [];

  const isOverMax = activeId.length >= props.max;

  return <View
    className="van-tree-select"
    style={{
      height: addUnit(props.height)
    }}
  >
    <ScrollView scroll-y className="van-tree-select__nav">
      <VanSidebar
        pid={props.pid}

        className="van-tree-select__nav__inner"
        custom-class="van-tree-select__nav__inner"
        activeKey={mainActiveIndex}
        onChange={setmainActiveIndex}
      >
        {props.items.map((item, index) => {
          return <VanSidebarItem
            key={item.text}
            custom-class="main-item-class"
            className="main-item-class"
            active-class="main-active-class"
            activeClass="main-active-class"
            disabled-class="main-disabled-class"
            disabledClass="main-disabled-class"
            info={item.info}
            dot={item.dot}
            title={item.text}
            disabled={item.disabled}

            pid={props.pid}
            index={index}
            total={props.items.length}
          />
        })}
      </VanSidebar>
    </ScrollView>
    <ScrollView scroll-y className="van-tree-select__content">
      {props.renderContent}
      {subItems.map((item) => {
        return <View
          key={item.id}
          className={
            classnames(
              "van-ellipsis",
              isExternalClass && "content-item-class",
              isNormalClass && props.contentItemClass,
              bem('tree-select__item', {
                active: activeId.includes(item.id),
                disabled: item.disabled
              }),
              activeId.includes(item.id) && (
                (isExternalClass && 'content-active-class') ||
                (isNormalClass && props.contentActiveClass)
              ),
              item.disabled && (
                (isExternalClass && 'content-disabled-class') ||
                (isNormalClass && props.contentDisabledClass)
              )
            )
          }
          onClick={() => {

            const isSelected = activeId.includes(item.id)
            if (item.disabled) {
              return ;
            } else {
              if (isSelected) {
                // select -> unselect
                props.onClickItem(item)
                setactiveId(
                  activeId.filter(v => v !== item.id)
                )
              } else {
                if (isOverMax) {
                  if (props.max === 1) {
                    props.onClickItem(item)
                    setactiveId(
                      [item.id]
                    )
                  }
                  return ;
                } else {
                  // unselect -> select
                  props.onClickItem(item)
                  setactiveId(
                    [...activeId, item.id]
                  )
                }
              }
            }
          }}
        >
          {item.text}
          {activeId.includes(item.id) && <VanIcon
            name={props.selectedIcon}
            size={15}
            custom-class="van-tree-select__selected"
            className="van-tree-select__selected"
          />}
        </View>
      })}
    </ScrollView>
  </View >
}

VanTreeSelect.options = {
  addGlobalClass: true
}

VanTreeSelect.externalClasses = [
  'custom-class',
  'main-item-class',
  'content-item-class',
  'main-active-class',
  'content-active-class',
  'main-disabled-class',
  'content-disabled-class',
]
VanTreeSelect.defaultProps = DefaultProps
export default VanTreeSelect
