import { Block } from '@tarojs/components';
import Taro, { useState } from '@tarojs/taro';
import VanCell from 'src/components/vant-react/Cell';
import VanStepper from 'src/components/vant-react/Stepper';
import VanToast from 'src/components/vant-react/Toast';
import { Toast } from 'src/components/vant-react/Toast/toast';

import "./index.less";

export default function StepperPage() {
  const [value, setValue] = useState(1);

  return <Block>
    <VanCell center title="基础用法">
      <VanStepper value={1} />
    </VanCell>

    <VanCell center title="步长设置">
      <VanStepper defaultValue={1} step={2} />
    </VanCell>

    <VanCell center title="限制输入范围">
      <VanStepper defaultValue={1} min={5} max={8} />
    </VanCell>

    <VanCell center title="限制输入整数">
      <VanStepper value={1} integer />
    </VanCell>

    <VanCell center title="禁用状态">
      <VanStepper value={1} disabled />
    </VanCell>

    <VanCell center title="禁用长按">
      <VanStepper value={1} longPress={false} />
    </VanCell>

    <VanCell center title="固定小数位数">
      <VanStepper value={1} step={0.2} decimalLength={1} />
    </VanCell>

    <VanCell center title="异步变更">
      <VanStepper
        value={value}
        manualChange
        onChange={({
          // previousValue,
          // value,
          updateValue,
          // revertValue
        }) => {
          const id = Toast.loading({
            forbidClick: true
          });
          setTimeout(() => {
            id && id.clear();
            updateValue()
            // setValue(value)
          }, 500);
        }}
      />
    </VanCell>

    <VanCell center title="自定义大小">
      <VanStepper value={1} inputWidth={40} buttonSize={64} />
    </VanCell>

    <VanToast id="van-toast" />

  </Block>
}

StepperPage.options = {
  addGlobalClass: true
}
