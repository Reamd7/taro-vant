import Taro from "@tarojs/taro";
import { useState } from '@tarojs/taro' /** api **/;
import "./index.less";
import { Block, View } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanUploader, { VanUploaderFile, VanImageType } from "src/components/vant-react/Uploader";
import VanButton from "src/components/vant-react/Button";

export default function VanUploaderPage() {
  const [fileList1, setfileList1] = useState<VanUploaderFile[]>([]);
  const [fileList7, setfileList7] = useState<VanUploaderFile[]>([]);
  const [fileList2, setfileList2] = useState<VanUploaderFile[]>([]);
  const [fileList8, setfileList8] = useState<VanUploaderFile[]>([]);
  const [fileList3, setfileList3] = useState<VanUploaderFile[]>([
    {
      url: 'https://img.yzcdn.cn/vant/leaf.jpg',
      status: 'uploading',
      message: '上传中',
      type: "image",
      size: 17407,
      thumb: 'https://img.yzcdn.cn/vant/leaf.jpg',
    },
    {
      url: 'https://img.yzcdn.cn/vant/tree.jpg',
      status: 'failed',
      message: '上传失败',
      type: "image",
      size: 34185,
      thumb: 'https://img.yzcdn.cn/vant/tree.jpg',
    },
  ]);
  const [fileList4, setfileList4] = useState<VanUploaderFile[]>([]);
  const [fileList5, setfileList5] = useState<VanUploaderFile[]>([]);
  const [fileList6, setfileList6] = useState<VanUploaderFile[]>([]);
  const [cloudPath, setcloudPath] = useState<ICloud.UploadFileResult[]>([]);

  return <Block>
    <DemoBlock title="基础用法" padding>
      <VanUploader
        name="1"
        accept="image"
        FileList={fileList1}
        onAfterRead={(file) => {
          setfileList1(
            fileList1.concat(file)
          )
        }}
        onDelete={({ index }) => {
          const fileList = fileList1;
          fileList.splice(index, 1);
          setfileList1(fileList.slice())
        }}
      />
    </DemoBlock>
    <DemoBlock title="上传视频 video" padding>
      <VanUploader
      multiple
        accept="video"
        FileList={fileList7}
        onAfterRead={(file) => {
          setfileList7(
            fileList7.concat(file)
          )
        }}
        onDelete={({ index }) => {
          const fileList = fileList7;
          fileList.splice(index, 1);
          setfileList7(fileList.slice())
        }}
      />
    </DemoBlock>
    <DemoBlock title="媒体选择 media" padding>
      <VanUploader
        accept="media"
        multiple
        maxCount={9}
        FileList={fileList7}
        onAfterRead={(file) => {
          console.log(file)
          setfileList7(
            fileList7.concat(file)
          )
        }}
        onDelete={({ index }) => {
          const fileList = fileList7;
          fileList.splice(index, 1);
          setfileList7(fileList.slice())
        }}
      />
    </DemoBlock>
    <DemoBlock title="文件预览" padding>
      <VanUploader
        multiple
        FileList={fileList2}
        onAfterRead={(file) => {
          setfileList2(
            fileList2.concat(file)
          )
        }}
        onDelete={({ index }) => {
          const fileList = fileList2;
          fileList.splice(index, 1);
          setfileList2(fileList.slice())
        }}
        previewFullImage={false} // 禁止全屏预览
        onClickPreview={({ index, file }) => {
          console.log(index, file) // 这个操作可以自己控制预览事件
        }}
      />
    </DemoBlock>
    <DemoBlock title="隐藏上传按钮" padding>
      <VanUploader
        multiple
        FileList={fileList2}
        onAfterRead={(file) => {
          setfileList2(
            fileList2.concat(file)
          )
        }}
        onDelete={({ index }) => {
          const fileList = fileList2;
          fileList.splice(index, 1);
          setfileList2(fileList.slice())
        }}
        showUpload={false}
        onClickPreview={({ index, file }) => {
          console.log(index, file) // 这个操作可以自己控制预览事件
        }}
      />
    </DemoBlock>
    <DemoBlock title="限制上传数量" padding>
      <VanUploader
        multiple
        accept="all"
        FileList={fileList8}
        onAfterRead={(file) => {
          setfileList8(
            fileList8.concat(file)
          )
        }}
        maxCount={2}
        onDelete={({ index }) => {
          const fileList = fileList8;
          fileList.splice(index, 1);
          setfileList8(fileList.slice())
        }}
      />
    </DemoBlock>
    <DemoBlock title="上传状态" padding>
      <VanUploader
        multiple
        FileList={fileList3}
        onAfterRead={(file) => {
          setfileList3(
            fileList3.concat(file)
          )
        }}
        maxCount={2}
        onDelete={({ index }) => {
          const fileList = fileList3;
          fileList.splice(index, 1);
          setfileList3(fileList.slice())
        }}
      />
    </DemoBlock>
    <DemoBlock title="自定义上传样式" padding>
      <VanUploader
        multiple
        FileList={fileList4}
        onAfterRead={(file) => {
          setfileList4(
            fileList4.concat(file)
          )
        }}
        onDelete={({ index }) => {
          const fileList = fileList4;
          fileList.splice(index, 1);
          setfileList4(fileList.slice())
        }}
      >
        <VanButton icon="photo" type="primary">上传图片</VanButton>
      </VanUploader>
    </DemoBlock>
    <DemoBlock title="上传前校验" padding>
      <VanUploader
        FileList={fileList5}
        onBeforeRead={(file: VanImageType[]) => {
          if (
            file.some(val =>
              !/\.(jpeg|jpg)/i.test(
                val.url
              )
            )
          ) {
            Taro.showToast({ title: '请选择jpg图片上传', icon: 'none' });
            return [];
          }
          return file
        }}
        onAfterRead={(file) => {
          setfileList5(
            fileList5.concat(file)
          )
        }}
        maxSize={100000}
        onDelete={({ index }) => {
          const fileList = fileList5;
          fileList.splice(index, 1);
          setfileList5(fileList.slice())
        }}
        onOversize={() => {
          Taro.showToast({ title: '文件超出大小限制', icon: 'none' });
        }}
      />
    </DemoBlock>
    <DemoBlock title="云存储上传" padding>
      <VanUploader
        FileList={fileList6}
        onBeforeRead={(file: VanImageType[]) => {
          if (
            file.some(val =>
              !/\.(jpeg|jpg)/i.test(
                val.url
              )
            )
          ) {
            Taro.showToast({ title: '请选择jpg图片上传', icon: 'none' });
            return [];
          }
          return file
        }}
        onAfterRead={(file) => {
          setfileList6(
            fileList6.concat(file)
          )
        }}
        onDelete={({ index }) => {
          const fileList = fileList6;
          fileList.splice(index, 1);
          setfileList6(fileList.slice())
        }}
      >

      </VanUploader>
      <View className="demo-margin-bottom">
          <VanButton type="primary" onClick={() => {
            if (process.env.TARO_ENV === "weapp") {
              Taro.cloud.init();
              if (!fileList6.length) {
                Taro.showToast({ title: '请选择图片', icon: 'none' });
              } else {
                Promise.all(
                  fileList6.map((file: VanImageType, index) => {
                    return Taro.cloud.uploadFile({
                      cloudPath: `my-photo${index}.png`,
                      filePath: ''
                    })
                  })
                )
                  .then((data) => {
                    Taro.showToast({ title: '上传成功', icon: 'none' });
                    setcloudPath(data)
                  })
                  .catch((e) => {
                    Taro.showToast({ title: '上传失败', icon: 'none' });
                    console.log(e);
                  });
              }
            }
          }}>上传至云存储</VanButton>
        </View>
    </DemoBlock>
  </Block >
}

VanUploaderPage.options = {
  addGlobalClass: true
}

VanUploaderPage.config = {
  "navigationBarTitleText": "Uploader 文件上传"
}
