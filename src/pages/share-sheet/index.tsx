import Taro from "@tarojs/taro";
import { useState } from 'react';
import { View } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanCell from "src/components/vant-react/Cell";
import VanShareSheet from "src/components/vant-react/ShareSheet";
const onSelect = (e: any) => {
  console.log(e);
};
export default function ShareSheetPage() {
  const [basic, setBasic] = useState(false);
  const [withDesc, setwithDesc] = useState(false);
  const [multiLine, setmultiLine] = useState(false);
  const [customIcon, setcustomIcon] = useState(false);

  return (
    <View>
      <DemoBlock title="基础用法">
        <VanCell
          isLink
          title="显示分享面板"
          onClick={() => {
            setBasic(true);
          }}
        />
        <VanShareSheet
          show={basic}
          title="立即分享给好友"
          options={[
            { name: "微信", icon: "wechat", openType: "share" },
            { name: "微博", icon: "weibo" },
            { name: "复制链接", icon: "link" },
            { name: "分享海报", icon: "poster" },
            { name: "二维码", icon: "qrcode" }
          ]}
          onClose={() => setBasic(false)}
          onSelect={e => {
            onSelect(e);
            setBasic(false);
          }}
        />
      </DemoBlock>

      <DemoBlock title="展示多行选项">
        <VanCell
          isLink
          title="显示分享面板"
          data-type="multiLine"
          onClick={() => {
            setmultiLine(true);
          }}
        />
        <VanShareSheet
          show={multiLine}
          title="立即分享给好友"
          options={[
            [
              { name: "微信", icon: "wechat" },
              { name: "微博", icon: "weibo" },
              { name: "QQ", icon: "qq" }
            ],
            [
              { name: "复制链接", icon: "link" },
              { name: "分享海报", icon: "poster" },
              { name: "二维码", icon: "qrcode" }
            ]
          ]}
          onClose={() => setmultiLine(false)}
          onSelect={e => {
            onSelect(e);
            setmultiLine(true);
          }}
        />
      </DemoBlock>

      <DemoBlock title="自定义图标">
        <VanCell
          isLink
          title="显示分享面板"
          data-type="customIcon"
          onClick={() => {
            setcustomIcon(true);
          }}
        />
        <VanShareSheet
          show={customIcon}
          options={[
            {
              name: "名称",
              icon: "https://img.yzcdn.cn/vant/custom-icon-fire.png"
            },
            {
              name: "名称",
              icon: "https://img.yzcdn.cn/vant/custom-icon-light.png"
            },
            {
              name: "名称",
              icon: "https://img.yzcdn.cn/vant/custom-icon-water.png"
            }
          ]}
          onClose={() => setcustomIcon(false)}
          onSelect={e => {
            onSelect(e);
            setcustomIcon(false);
          }}
        />
      </DemoBlock>

      <DemoBlock title="展示描述信息">
        <VanCell
          isLink
          title="显示分享面板"
          data-type="withDesc"
          onClick={() => setwithDesc(true)}
        />
        <VanShareSheet
          show={withDesc}
          title="立即分享给好友"
          options={[
            { name: "微信", icon: "wechat" },
            { name: "微博", icon: "weibo" },
            {
              name: "复制链接",
              icon: "link",
              description: "描述信息"
            },
            { name: "分享海报", icon: "poster" },
            { name: "二维码", icon: "qrcode" }
          ]}
          description="描述信息"
          onClose={() => {
            setwithDesc(false);
          }}
          onSelect={e => {
            onSelect(e);
            setwithDesc(false);
          }}
        />
      </DemoBlock>

      {/* <van-toast id="van-toast" /> */}
    </View>
  );
}

ShareSheetPage.options = {
  addGlobalClass: true
}

ShareSheetPage.config = {
  "navigationBarTitleText": "Card 商品卡片"
}
