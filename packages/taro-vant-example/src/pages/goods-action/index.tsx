import Taro from "@tarojs/taro";

import "./index.less";
import { Block } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanGoodsAction from "taro-vant/GoodsAction";
import VanGoodsActionIcon from "taro-vant/GoodsActionIcon";
import VanGoodsActionButton from "taro-vant/GoodsActionButton";
import VanToast from "taro-vant/Toast";
import { Toast } from "taro-vant/Toast/toast";

export default function VanGoodsActionPage() {
  return <Block>

    <DemoBlock title="基础用法">
      <VanGoodsAction custom-class="goods-action-position" className="goods-action-position" safeAreaInsetBottom={false}>
        <VanGoodsActionIcon
          icon="chat-o"
          text="客服"
          openType="contact"
        />
        <VanGoodsActionIcon
          icon="cart-o"
          text="购物车"
          onClick={()=>{
            Toast({
              gid: "van-toast",
              message: "购物车"
            })
          }}
        />
        <VanGoodsActionButton
          text="加入购物车"
          type="warning"
          isFirst
          onClick={()=>{
            Toast({
              gid: "van-toast",
              message: "加入购物车"
            })
          }}
        />
        <VanGoodsActionButton
          text="立即购买"
          isLast
          onClick={()=>{
            Toast({
              gid: "van-toast",
              message: "立即购买"
            })
          }}
        />
      </VanGoodsAction>
    </DemoBlock>

    <DemoBlock title="提示信息">
      <VanGoodsAction custom-class="goods-action-position" className="goods-action-position"
        safeAreaInsetBottom={false}>
        <VanGoodsActionIcon icon="chat-o" text="客服" dot />
        <VanGoodsActionIcon icon="cart-o" text="购物车" info="5" />
        <VanGoodsActionIcon icon="shop-o" text="店铺" />
        <VanGoodsActionButton text="购物车" type="warning" isFirst />
        <VanGoodsActionButton text="加入收藏" type="info" />
        <VanGoodsActionButton text="立即购买" isLast />
      </VanGoodsAction>
    </DemoBlock>

    <DemoBlock title="自定义按钮颜色">
      <VanGoodsAction custom-class="goods-action-position" className="goods-action-position"
        safeAreaInsetBottom={false}>
        <VanGoodsActionIcon icon="chat-o" text="客服" />
        <VanGoodsActionIcon icon="shop-o" text="店铺" />
        <VanGoodsActionButton color="#be99ff" type="warning" text="加入购物车" isFirst />
        <VanGoodsActionButton color="#7232dd" text="立即购买" isLast />
      </VanGoodsAction>
    </DemoBlock>

    <DemoBlock title="朴素按钮">
      <VanGoodsAction custom-class="goods-action-position" className="goods-action-position"
        safeAreaInsetBottom={false}>
        <VanGoodsActionIcon icon="chat-o" text="客服" />
        <VanGoodsActionIcon icon="shop-o" text="店铺" />
        <VanGoodsActionButton color="#7232dd" text="加入购物车" type="warning" isFirst />
        <VanGoodsActionButton plain color="#7232dd" text="立即购买" isLast />
      </VanGoodsAction>
    </DemoBlock>

    <VanToast gid="van-toast" />
  </Block>
}

VanGoodsActionPage.config = {
  "navigationBarTitleText": "GoodsAction 商品导航"
}

VanGoodsActionPage.options = {
  addGlobalClass: true
}
