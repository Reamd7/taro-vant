import Taro from "@tarojs/taro";
const { useCallback } = Taro /** api **/;
import "./index.less";
import { Block, View, Text } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanSubmitBar from "src/components/vant-react/SubmitBar";
import VanToast from "src/components/vant-react/Toast";
import VanTag from "src/components/vant-react/Tag";
import { Toast } from "src/components/vant-react/Toast/toast";

export default function VanSubmitBarPage() {
  const onClickButton = useCallback(()=>{
    Toast('点击按钮');
  }, [])
  const onClickLink = useCallback(()=>{
    Toast('修改地址');
  }, [])
  return <Block>
    <DemoBlock title="基础用法">
      <VanSubmitBar
        price={3050}
        buttonText="提交订单"
        onSubmit={onClickButton}
        custom-class="VanSubmitBar" className="VanSubmitBar"
        safeAreaInsetBottom={false}
      />
    </DemoBlock>

    <DemoBlock title="禁用状态">
      <VanSubmitBar
        disabled
        price={3050}
        buttonText="提交订单"
        tip="您的收货地址不支持同城送, 我们已为您推荐快递"
        tipIcon="//img.yzcdn.cn/public_files/2017/8/10/6af5b7168eed548100d9041f07b7c616.png"
        onSubmit={onClickButton}
        custom-class="VanSubmitBar" className="VanSubmitBar"
        safeAreaInsetBottom={false}
      />
    </DemoBlock>

    <DemoBlock title="加载状态 + 文字自定义对齐方式">
      <VanSubmitBar
        loading
        price={3050}
        buttonText="提交订单"
        onSubmit={onClickButton}
        custom-class="VanSubmitBar" className="VanSubmitBar"
        safeAreaInsetBottom={false}
        textAlign={"center"}
      />
    </DemoBlock>

    <DemoBlock title="高级用法">
      <VanSubmitBar
        price={3050}
        buttonText="提交订单"
        onSubmit={onClickButton}
        custom-class="VanSubmitBar" className="VanSubmitBar"
        tip={true}
        safeAreaInsetBottom={false}

        renderTips={
          <View >
            您的收货地址不支持同城送
            <Text className="edit-address" onClick={onClickLink}>修改地址</Text>
          </View>
        }
      >
        <VanTag type="primary" custom-class="submit-tag" className="submit-tag">标签</VanTag>
      </VanSubmitBar>
    </DemoBlock>

    <VanToast />

  </Block >
}

VanSubmitBarPage.options = {
  addGlobalClass: true
}
VanSubmitBarPage.config = {
  navigationBarTitleText: "SubmitBar 提交订单栏"
}
