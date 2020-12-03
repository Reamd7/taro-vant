import { View } from '@tarojs/components'
import Taro, { useState, useCallback, useEffect } from '@tarojs/taro'

import './index.less'
import VanIndexList from 'src/components/vant-react/IndexList'
import { isWeapp } from 'src/components/vant-react/common/utils';
let getCitysPromise: Promise<any>
if (isWeapp) {
  const QQMapWX = require('./lib/qqmap-wx-jssdk.min.js');
  const QQMapKey = 'NDLBZ-4Y6KF-S2LJ6-NAOAA-BOW56-LMB44'
  const qqmapsdk = new QQMapWX.default({ key: QQMapKey })

  getCitysPromise = new Promise<any>(resolve => {
    qqmapsdk.getCityList({
      success(res) {
        resolve(res)
      }
    })
  })
} else {
  const res = require("./lib/res.json");
  console.log(res)
  getCitysPromise = Promise.resolve(res)
}


export default function VanInPage() {
  const [list, setlist] = useState<Array<{
    alpha: string;
    subItems: Array<{
      name: string | number;
    }>
  }>>([]);

  const getCitys = useCallback(() => {
    getCitysPromise.then((res) => {
      const cities = res.result[1]
      // 按拼音排序
      cities.sort((c1, c2) => {
        let pinyin1 = c1.pinyin.join('')
        let pinyin2 = c2.pinyin.join('')
        return pinyin1.localeCompare(pinyin2)
      })
      // 添加首字母
      const map: Record<string, Array<{ name: string | number }>> = {}
      for (const city of cities) {
        const alpha = city.pinyin[0].charAt(0).toUpperCase() as string
        if (!(alpha in map)) {
          map[alpha] = []
        }
        map[alpha].push({ name: city.fullname })
      }

      const keys: string[] = []
      for (const key of Object.keys(map)) {
        keys.push(key)
      }
      keys.sort()

      const list: Array<{
        alpha: string;
        subItems: Array<{
          name: string | number;
        }>
      }> = []
      for (const key of keys) {
        list.push({
          alpha: key,
          subItems: map[key]
        })
      }
      setlist(list)
    })
  }, [])

  useEffect(() => {
    getCitys()
  }, [])

  return (
    <VanIndexList className="city__list" list={list} onChoose={(e) => {
      console.log('onChoose', e)
    }}>
      <View className="page">
        <View className="page__hd">
          <View className="page__title">Index List</View>
          <View className="page__desc">类通讯录列表</View>
        </View>
        <View className="page__bd"></View>
      </View>
    </VanIndexList>
  )
}

VanInPage.options = {
  addGlobalClass: true
}
VanInPage.config = {

}
