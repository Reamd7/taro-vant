import Taro, { NodesRef } from "@tarojs/taro";
import "./index.less";
import { ActiveProps, getRect, nextTick } from "../utils"
import { View } from "@tarojs/components";
import { pageScrollMixin } from "./common.weapp";

export type VanStickyProps = {
  zIndex?: number;
  offsetTop?: number;
  disabled?: boolean;
  container?: () => Taro.NodesRef;
  scrollTop?: number;

  className?: string;
  ['custom-class']?: string;

  onScroll?: (e: {
    scrollTop: number;
    isFixed: boolean;
  }) => void;
}

const DefaultProps = {
  zIndex: 99,
  offsetTop: 0
}

type ActiveVanStickyProps = ActiveProps<VanStickyProps, keyof typeof DefaultProps>
const ROOT_ELEMENT = '.van-sticky';

const VanSticky: Taro.FunctionComponent<VanStickyProps> = (props: ActiveVanStickyProps) => {
  return <View style="{{ computed.containerStyle({ fixed, height, zIndex }) }}">
    <wxs src="../common/wxs/utils.wxs" module="utils" />
    <wxs src="./index.wxs" module="computed" />
    <View className='van-sticky custom-class'>
      <View className="{{ utils.bem('sticky-wrap', { fixed }) }}"
        style="{{ computed.wrapStyle({ fixed, offsetTop, transform, zIndex }) }}"
      >
        {props.children}
      </View>
    </View>
  </View>
}

VanSticky.externalClasses = [
  'custom-class'
]
VanSticky.options = {
  addGlobalClass: true
}
VanSticky.defaultProps = DefaultProps;

(VanSticky as any).behaviors = [
  Behavior({
    properties: {
      zIndex: {
        type: Number,
        value: 99,
      },
      offsetTop: {
        type: Number,
        value: 0,
        observer: 'onScroll',
      },
      disabled: {
        type: Boolean,
        observer: 'onScroll',
      },
      container: {
        type: null,
        observer: 'onScroll',
      },
      scrollTop: {
        type: null,
        observer(val) {
          this.onScroll({ scrollTop: val });
        },
      },
    },
    behaviors: [
      pageScrollMixin(function (event) {
        if (this.data.scrollTop != null) {
          return;
        }
        this.onScroll(event);
      })
    ],
    data: {
      height: 0,
      fixed: false,
      transform: 0,
    },
    ready() {
      this.onScroll();
    },
    methods: {
      onScroll({ scrollTop } = {}) {
        const { container, offsetTop, disabled } = this.data;

        if (disabled) {
          this.setDataAfterDiff({
            fixed: false,
            transform: 0,
          });
          return;
        }

        this.scrollTop = scrollTop || this.scrollTop;

        if (typeof container === 'function') {
          Promise.all([
            getRect(this, ROOT_ELEMENT),
            new Promise<NodesRef.BoundingClientRectCallbackResult>((resolve) => {
              // getContainerRect
              const nodesRef = container();
              nodesRef.boundingClientRect(resolve).exec()
            })
          ]).then(
            ([root, container]) => {
              if (offsetTop + root.height > container.height + container.top) {
                this.setDataAfterDiff({
                  fixed: false,
                  transform: container.height - root.height,
                });
              } else if (offsetTop >= root.top) {
                this.setDataAfterDiff({
                  fixed: true,
                  height: root.height,
                  transform: 0,
                });
              } else {
                this.setDataAfterDiff({ fixed: false, transform: 0 });
              }
            }
          );

          return;
        }

        getRect(this, ROOT_ELEMENT).then((root) => {
          if (offsetTop >= root.top) {
            this.setDataAfterDiff({ fixed: true, height: root.height });
            this.transform = 0;
          } else {
            this.setDataAfterDiff({ fixed: false });
          }
        });
      },

      setDataAfterDiff(data) {
        nextTick(() => {
          const diff = Object.keys(data).reduce((prev, key) => {
            if (data[key] !== this.data[key]) {
              prev[key] = data[key];
            }

            return prev;
          }, {});

          this.setData(diff);

          this.triggerEvent('scroll', {
            scrollTop: this.scrollTop,
            isFixed: data.fixed || this.data.fixed,
          });
        });
      },
    },
  })
];
export default VanSticky
