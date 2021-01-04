import Taro from "@tarojs/taro";
const { useState } = Taro /** api **/;
import "./index.less";
import { View } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanCellGroup from "taro-vant/CellGroup";
import VanFieldText from "taro-vant/Field/VanFieldText";
import VanFieldTextarea from "taro-vant/Field/VanFieldTextarea";
import VanButton from "taro-vant/Button";
import VanFieldNumber from "taro-vant/Field/VanFieldNumber";


export default function FieldPage() {
  const [value, setValue] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('')

  const [username2, setUsername2] = useState('');
  const [phone, setPhone] = useState('');

  const [message, setMessage] = useState('asdasdasdsad\nadasdasddas');
  const [sms, setSms] = useState(NaN);

  return <View>
    <DemoBlock title="基础用法">
      <VanCellGroup>
        <VanFieldText
          type="text"
          placeholder="请输入用户名"
          border={false}
          clearable
          value={value}
          onChange={setValue}
        />
      </VanCellGroup>
    </DemoBlock>
    <DemoBlock title="自定义类型">
      <VanCellGroup>
        <VanFieldText
          type="text"
          label="用户名"
          placeholder="请输入用户名"
          clearable
          rightIcon="question-o"
          rightIconClass="custom-icon"
          right-icon-class="custom-icon"
          required
          value={username}
          onChange={setUsername}
          onClickIcon={() => {
            Taro.showToast({
              title: username
            })
          }}
        />
      </VanCellGroup>
      <VanCellGroup>
        <VanFieldText
          value={password}
          onChange={setPassword}
          type="password"
          label="密码"
          placeholder="请输入密码"
          required
          border={false}
        />
      </VanCellGroup>
    </DemoBlock>
    <DemoBlock title="禁用输入框">
      <VanCellGroup>
        <VanFieldText
          type="text"
          value="输入框已禁用"
          label="用户名"
          leftIcon="contact"
          disabled
          border={false}
        />
      </VanCellGroup>
    </DemoBlock>
    <DemoBlock title="错误提示">
      <VanCellGroup>
        <VanFieldText
          value={username2}
          type="text"
          label="用户名"
          placeholder="请输入用户名"
          error
          onChange={setUsername2}
        />
        <VanFieldText
          value={phone}
          type="number"
          label="手机号"
          placeholder="请输入手机号"
          errorMessage="手机号格式错误"
          border={false}
          onChange={setPhone}
        />
      </VanCellGroup>
    </DemoBlock>
    <DemoBlock title="内容对齐方式">
      <VanCellGroup>
        <VanFieldText
          type="text"
          value={username2}
          leftIcon="contact"
          label="用户名"
          placeholder="请输入用户名"
          inputAlign="right"
          onChange={setUsername2}
        />
      </VanCellGroup>
    </DemoBlock>
    <DemoBlock title="高度自适应">
      <VanCellGroup>
        <VanFieldTextarea
          type="textarea"
          label="留言"
          placeholder="请输入留言"
          autoSize={{
            maxHeight: 50,
            minHeight: 20
          }}
          border={false}
          value={message}
          onChange={setMessage}
        />
      </VanCellGroup>
    </DemoBlock>
    <DemoBlock title="插入按钮">
      <VanCellGroup>
        <VanFieldNumber
          type="digit"
          value={sms}
          center
          clearable
          label="短信验证码"
          placeholder="请输入短信验证码"
          border={false}
          useButtonSlot={true}
          renderButton={
            <VanButton size="small" type="primary" custom-class="button" onClick={()=>{
              console.log(JSON.stringify({
                  value,
                  username,
                  password,
                  username2,
                  phone,
                  message,
                  sms
                })
              )
            }} >发送验证码</VanButton>
          }
          onChange={setSms}
        />
      </VanCellGroup>
    </DemoBlock>
  </View>
}

FieldPage.options = {
  addGlobalClass: true
}
FieldPage.config = {
  "navigationBarTitleText": "Field 输入框"
}
