import Taro from '@tarojs/taro';
import { ActiveVanUploaderProps, VanUploaderFile } from '.';

const IMAGE_REGEXP = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)/i;
const VIDEO_REGEXP = /\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv)/i;
export function isImageUrl(url: string): boolean {
  return IMAGE_REGEXP.test(url);
}
export function isVideoUrl(url: string): boolean {
  return VIDEO_REGEXP.test(url);
}

export function chooseFile({
  accept, multiple, capture, compressed, maxDuration, sizeType, camera, maxCount
}: {
  accept: ActiveVanUploaderProps['accept'],
  multiple: ActiveVanUploaderProps['multiple'],
  capture: ActiveVanUploaderProps['capture'],
  compressed: ActiveVanUploaderProps['compressed'],
  maxDuration: ActiveVanUploaderProps['maxDuration'],
  sizeType: ActiveVanUploaderProps['sizeType'],
  camera: ActiveVanUploaderProps['camera'],
  maxCount: ActiveVanUploaderProps['maxCount'],
}): Promise<VanUploaderFile[]> {
  switch (accept) {
    case "image":
      return Taro.chooseImage({
        count: multiple ? Math.min(maxCount, 0) : 1,
        sourceType: capture,
        sizeType,
      }).then(res => {
        return res.tempFiles.filter(item => {
          return IMAGE_REGEXP.test(item.path)
        }).map(item => ({
          url: item.path,
          type: "image",
          thumb: item.path,
          name: item.path,
          size: item.size,
        }))
      })
    case 'media':
      return Taro.chooseMedia({
        count: multiple ? Math.min(maxCount, 9) : 1,
        sourceType: capture,
        maxDuration,
        sizeType,
        camera,
      }).then(res => {
        // console.log(res)
        return res.tempFiles.map((item) => ({
          url: item.tempFilePath,
          type: res.type as ("image" | "video"),
          thumb: res.type === 'video' ? item.thumbTempFilePath : item.tempFilePath,
          // name: item. ??
          size: item.size,
        }))
      })
    case "video":
      return new Promise<Taro.chooseVideo.SuccessCallbackResult>((resolve, reject) => {
        Taro.chooseVideo({
          sourceType: capture,
          compressed,
          maxDuration,
          camera,
          success: (res) => {
            resolve(
              res
            )
          },
          fail: (err) => {
            reject(err)
          }
        })
      }).then((res: Taro.chooseVideo.SuccessCallbackResult) => {
        return VIDEO_REGEXP.test(res.tempFilePath) ? [{
          type: "video",
          url: res.tempFilePath,
          thumb: (res as any).thumbTempFilePath,
          // thumb: res.tempFilePath,
          size: res.size,
        }] : []
      })
    default:
      return Taro.chooseMessageFile({
        count: multiple ? maxCount : 1,
        type: accept,
      }).then(res => {
        // console.log(res)
        return res.tempFiles.map((item) => ({
          url: item.path,
          type: "file",
          name: item.name,
          size: item.size,
        }))
      })
  }
}
