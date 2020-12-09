import Taro from "@tarojs/taro";
import { useState, useCallback } from 'react';
import { Block, View } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanSearch from "src/components/vant-react/Search";

export default function SearchPage() {
  const [value, setValue] = useState('');

  const onSearch = useCallback(() => {
    Taro.showToast({
      title: '搜索：' + value,
      icon: 'none'
    });
  }, [value])
  const onClick = useCallback(() => {
    Taro.showToast({
      title: '搜索：' + value,
      icon: 'none'
    });
  }, [value])
  const onCancel = useCallback(() => {
    Taro.showToast({
      title: '取消',
      icon: 'none'
    });
  }, [value])
  const onClear = useCallback(() => {
    Taro.showToast({
      title: '清空',
      icon: 'none'
    });
  }, [value])
  return <Block>
    <DemoBlock title="基本用法">
      <VanSearch
        placeholder="请输入搜索关键词"
        onSearch={onSearch}
        value={value}
        onChange={setValue}
      />
    </DemoBlock>
    <DemoBlock title="事件监听">
      <VanSearch
        value={value} onChange={setValue}
        showAction
        placeholder="请输入搜索关键词"
        onSearch={onSearch}
        onCancel={onCancel}
        onClear={onClear}
      />
    </DemoBlock>

    <DemoBlock title="搜索框内容对齐">
      <VanSearch
        value={value} onChange={setValue}
        inputAlign="center"
        placeholder="请输入搜索关键词"
      />
    </DemoBlock>

    <DemoBlock title="禁用搜索框">
      <VanSearch
        disabled
        value={value} onChange={setValue}
        placeholder="请输入搜索关键词"
      />
    </DemoBlock>

    <DemoBlock title="自定义背景色">
      <VanSearch
        value={value} onChange={setValue}
        shape="round"
        background="#4fc08d"
        placeholder="请输入搜索关键词"
      />
    </DemoBlock>

    <DemoBlock title="自定义按钮">
      <VanSearch
        value={value} onChange={setValue}
        label="地址"
        shape="round"
        placeholder="请输入搜索关键词"
        useActionSlot
        onSearch={onSearch}
        renderAction={
          <View onClick={onClick}>搜索</View>
        }
      >
      </VanSearch>
    </DemoBlock >
  </Block >
}

SearchPage.options = {
  addGlobalClass: true
}

SearchPage.config = {
  "navigationBarTitleText": "Search 搜索"
}
