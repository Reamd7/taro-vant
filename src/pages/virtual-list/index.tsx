import Taro, { useRef, useState, useCallback, useEffect } from "@tarojs/taro";
import { Block, View } from "@tarojs/components";
import VanVirtualList, { VanVirtualListIns } from "src/components/vant-react/VirtualList";
import VanVirtualListItem from "src/components/vant-react/VirtualList/item";
import { BaseEventOrig } from "@tarojs/components/types/common";

let itemCount = 30
let itemUpdateCount = 40;
let items = [...new Array(itemCount)].map((_, i) => i)

export default function VLPage() {
  const [data, setData] = useState({
    startIndex: -1,
    endIndex: -1,
    disableScroll: false,
    height: 300,
    itemHeight: 50,
    itemBuffer: 30,
    scrollToIndex: 0,
    scrollWithAnimation: false,
    virtual: {
      items: [] as any[],
    }
  })
  const ref = useRef<VanVirtualListIns>();

  const updated = useCallback((items: any) => {
    const startTime = Date.now()
    ref.current!.render(items, () => {
      const diffTime = Date.now() - startTime
      console.log(`onSuccess - render time: ${diffTime}ms`)
    })
  }, [])

  const loadData = useCallback((_: BaseEventOrig<any>) => {
    if (itemCount >= 1000) return
    if (data.disableScroll) return
    setData((data) => ({ ...data, disableScroll: true }))
    Taro.showLoading({
      title: ''
    })
    setTimeout(() => {
      if (itemCount < 300) {
        itemCount += itemUpdateCount
        items = [...new Array(itemCount)].map((_, i) => i)
        updated(items)
      } else {
        updated([...items])
      }
      setData((data) => ({ ...data, disableScroll: false }))
      Taro.hideLoading()
    }, 1000)
  }, [data.disableScroll, updated])

  useEffect(() => {
    updated(items)
  }, []);

  return (
    <Block>
      <VanVirtualList pid="1111"
        height={data.height}
        itemHeight={data.itemHeight}
        itemBuffer={data.itemBuffer}
        scrollToIndex={data.scrollToIndex}
        scrollWithAnimation={data.scrollWithAnimation}
        disableScroll={data.disableScroll}
        onChange={(e) => {
          const { startIndex, endIndex } = e
          if (data.startIndex !== startIndex || data.endIndex !== endIndex) {
            setData((data) => ({
              ...data,
              virtual: {
                items: e.virtual.items
              },
              disableScroll: data.disableScroll,
              height: data.height,
              itemHeight: data.itemHeight,
              itemBuffer: data.itemBuffer,
              scrollToIndex: data.scrollToIndex,
              scrollWithAnimation: data.scrollWithAnimation,
            }))
          }
        }}
        onScrollToLower={(e) => {
          loadData(e)
        }}
        ins={(data) => {
          ref.current = data
        }}
      >
        {data.virtual.items.map((item, index) => {
          return <VanVirtualListItem pid="1111" index={index} total={data.virtual.items.length} key={item} dataKey={item}>
            <View className="item">
              <View className="index">{'#' + item}</View>
              <View className="desc">Wux NB</View>
            </View>
          </VanVirtualListItem>
        })}
      </VanVirtualList>
    </Block>
  );
}

VLPage.config = {
  "navigationBarTitleText": "Toast 轻提示"
}
