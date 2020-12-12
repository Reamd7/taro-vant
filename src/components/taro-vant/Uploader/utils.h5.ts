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

// 1. 当accept="image/*"时，capture="user"调用前置照相机，capture="其他值"，调用后置照相机
// 2. 当accept="video/*"时，capture="user"调用前置录像机，capture="其他值"，调用后置录像机
// 3. 当accept="image/*,video/*"，capture="user"调用前置摄像头，capture="其他值"，调用后置摄像头，默认照相，可切换录像
// 4. 当accept="audio/*"时，capture="放空或者任意值"，调用录音机
// 5. 当input没有capture时，根据accppt类型给出文件夹选项以及摄像头或者录音机选项
// 6. input含有multiple时访问文件夹可勾选多文件，调用系统摄像头或者录音机都只是单文件
// 7. 无multiple时都只能单文件

function chooseVideo(options: Taro.chooseVideo.Option) {
  // options must be an Object
  const videoid = 'taroChooseVideo';

  const { success, fail, complete, sourceType } = options
  const res: Taro.chooseVideo.SuccessCallbackResult = {
    /** 选定视频的时间长度 */
    duration: -1,
    /** 返回选定视频的高度 */
    height: -1,
    /** 选定视频的数据量大小 */
    size: -1,
    /** 选定视频的临时文件路径 */
    tempFilePath: '',
    /** 返回选定视频的宽度 */
    width: -1,
    /** 调用结果 */
    errMsg: 'chooseVideo:ok',
  }

  const sourceTypeString = sourceType && sourceType.toString()
  const capture = sourceType ? sourceType.includes('camera') : true

  let taroChooseVideo = document.getElementById(videoid) as HTMLInputElement | null

  if (!taroChooseVideo) {
    let obj = document.createElement('input')
    obj.setAttribute('type', 'file')
    obj.setAttribute('id', videoid)
    obj.setAttribute('accept', 'video/*')
    obj.setAttribute('style', 'position: fixed; top: -4000px; left: -3000px; z-index: -300;')
    if (capture && sourceTypeString) {
      obj.setAttribute('capture', "camera")
    }
    taroChooseVideo = document.body.appendChild(obj)!
    // taroChooseVideo.multiple = true
  } else {
    if (capture && sourceTypeString) {
      taroChooseVideo.setAttribute('capture', "camera")
    } else {
      taroChooseVideo.removeAttribute('capture')
    }
  }

  let taroChooseVideoCallback
  const taroChooseVideoPromise = new Promise<Taro.chooseVideo.SuccessCallbackResult>(resolve => {
    taroChooseVideoCallback = resolve
  })
  let TaroMouseEvents = document.createEvent('MouseEvents')
  TaroMouseEvents.initEvent('click', true, true)
  taroChooseVideo.dispatchEvent(TaroMouseEvents)
  taroChooseVideo.onchange = function (e) {
    // 这里只能单选。
    if (taroChooseVideo && taroChooseVideo.files && taroChooseVideo.files.length) {
      const item = taroChooseVideo.files.item(0);
      if (item) {
        let blob = new Blob([item], {
          type: item.type
        })
        let url = URL.createObjectURL(blob)
        res.tempFilePath = url;
        res.size = item.size;
        // -----------------------------------
        const VideoEl = document.createElement('video');
        VideoEl.src = url;
        VideoEl.onloadedmetadata = function () {
          res.width = VideoEl.videoWidth;
          res.height = VideoEl.videoHeight;
          res.duration = VideoEl.duration;
          VideoEl.remove()
          typeof success === 'function' && success(res)
          typeof complete === 'function' && complete(res)
          taroChooseVideoCallback(res)
          taroChooseVideo!.value = ''
        }
      }
    }
    // [...(taroChooseVideo!.files || [])].forEach(item => {
    //   let blob = new Blob([item], {
    //     type: item.type
    //   })
    //   let url = URL.createObjectURL(blob)
    //   res.tempFilePath = url;
    //   res.size = item.size;
    //   const el = document.createElement('video');
    //   el.src = url;
    //   el.onloadedmetadata = function() {
    //     res.width = el.videoWidth ;
    //     res.height = el.videoHeight;
    //     res.duration = el.duration;

    //     el.remove()

    //     typeof success === 'function' && success(res)
    //     typeof complete === 'function' && complete(res)
    //     taroChooseVideoCallback(res)
    //     taroChooseVideo!.value = ''
    //   }
    // })

  }
  return taroChooseVideoPromise
}
/**
 * 单选的图片和视频
 * @param options
 */
function chooseMedia(options: Taro.chooseMedia.Option) {
  const mediaid = 'taroChooseMedia';
  const { success, fail, sourceType, count } = options;

  const res: Taro.chooseMedia.SuccessCallbackResult = {
    tempFiles: [],
    type: "mdeia",
    /** 调用结果 */
    errMsg: 'chooseMedia:ok',
  }
  let taroChooseVideo = document.getElementById(mediaid) as HTMLInputElement | null
  if (!taroChooseVideo) {
    let obj = document.createElement('input')
    obj.setAttribute('type', 'file')
    obj.setAttribute('id', mediaid)
    obj.setAttribute('accept', 'image/*, video/*')
    obj.setAttribute('style', 'position: fixed; top: -4000px; left: -3000px; z-index: -300;')
    taroChooseVideo = document.body.appendChild(obj)!
    taroChooseVideo.multiple = (!!options.count && options.count > 1)
  } else {
    taroChooseVideo.multiple = (!!options.count && options.count > 1)
  }
  let taroChooseVideoCallback
  const taroChooseVideoPromise = new Promise<Taro.chooseMedia.SuccessCallbackResult>(resolve => {
    taroChooseVideoCallback = resolve
  })
  let TaroMouseEvents = document.createEvent('MouseEvents')
  TaroMouseEvents.initEvent('click', true, true)
  taroChooseVideo.dispatchEvent(TaroMouseEvents)
  taroChooseVideo.onchange = function (e) {
    Promise.all(
      [...(taroChooseVideo!.files || [])].map(item => {
        return new Promise<Taro.chooseMedia.ChooseMedia>((resolve, reject) => {
          let blob = new Blob([item], {
            type: item.type
          })
          let url = URL.createObjectURL(blob)
          if (item.type.includes("image")) {
            // image
            const image = new Image();
            image.onload = function () {
              resolve({
                /** 本地临时文件路径 (本地路径) */
                tempFilePath: url,
                /** 本地临时文件大小，单位 B */
                size: item.size,
                /** 视频的时间长度 */
                duration: -1,
                /** 视频的高度 */
                height: image.naturalHeight,
                /** 视频的宽度 */
                width: image.naturalWidth,
                /** 视频缩略图临时文件路径 */
                thumbTempFilePath: url
              })
              image.remove()
            }
            image.src = url;
          } else {
            // video
            const VideoEl = document.createElement('video');
            VideoEl.onloadedmetadata = function () {
              resolve({
                /** 本地临时文件路径 (本地路径) */
                tempFilePath: url,
                /** 本地临时文件大小，单位 B */
                size: item.size,
                /** 视频的时间长度 */
                duration: VideoEl.duration,
                /** 视频的高度 */
                height: VideoEl.videoHeight,
                /** 视频的宽度 */
                width: VideoEl.videoWidth,
                /** 视频缩略图临时文件路径 */
                thumbTempFilePath: ''
              })
              VideoEl.remove()
            }
            VideoEl.src = url;
          }
        })
      })
    ).then(tempFiles => {
      res.tempFiles = tempFiles.slice(0, count)
      typeof success === 'function' && success(res)
      // typeof complete === 'function' && complete(res)
      taroChooseVideoCallback(res)
      taroChooseVideo!.value = ''
    })
  }
  return taroChooseVideoPromise
}

function chooseMessageFile(options: Taro.chooseMessageFile.Option) {
  const mediaid = 'tarochooseMessageFile';
  const { success, fail, count } = options;

  const res: Taro.chooseMessageFile.SuccessCallbackResult = {
    tempFiles: [],
    /** 调用结果 */
    errMsg: 'chooseMessageFile:ok',
  }
  let taroChooseVideo = document.getElementById(mediaid) as HTMLInputElement | null
  if (!taroChooseVideo) {
    let obj = document.createElement('input')
    obj.setAttribute('type', 'file')
    obj.setAttribute('id', mediaid)
    obj.setAttribute('accept', '*')
    obj.setAttribute('style', 'position: fixed; top: -4000px; left: -3000px; z-index: -300;')
    taroChooseVideo = document.body.appendChild(obj)!
    taroChooseVideo.multiple = (!!options.count && options.count > 1)
  } else {
    taroChooseVideo.multiple = (!!options.count && options.count > 1)
  }
  let taroChooseVideoCallback
  const taroChooseVideoPromise = new Promise<Taro.chooseMessageFile.SuccessCallbackResult>(resolve => {
    taroChooseVideoCallback = resolve
  })
  let TaroMouseEvents = document.createEvent('MouseEvents')
  TaroMouseEvents.initEvent('click', true, true)
  taroChooseVideo.dispatchEvent(TaroMouseEvents)
  taroChooseVideo.onchange = function (e) {
    Promise.resolve<Taro.chooseMessageFile.ChooseFile[]>(
      [...(taroChooseVideo!.files || [])].map(item => {
        let blob = new Blob([item], {
          type: item.type
        })
        let url = URL.createObjectURL(blob)
        return {
          /** 选择的文件名称 */
          name: item.name,
          /** 本地临时文件路径 */
          path: url,
          /** 本地临时文件大小，单位 B */
          size: item.size,
          /** 选择的文件的会话发送时间，Unix时间戳，工具暂不支持此属性 */
          time: item.lastModified,
          /** 选择的文件类型  */
          type: item.type.includes("image") ? "image" : item.type.includes("video") ? "video" : "file"
        }

        // return new Promise<Taro.chooseMessageFile.ChooseFile>((resolve, reject) => {
        //   let blob = new Blob([item], {
        //     type: item.type
        //   })
        //   let url = URL.createObjectURL(blob)
        //   if (item.type.includes("image")) {
        //     // image
        //     const image = new Image();
        //     image.onload = function () {
        //       resolve({
        //         /** 本地临时文件路径 (本地路径) */
        //         tempFilePath: url,
        //         /** 本地临时文件大小，单位 B */
        //         size: item.size,
        //         /** 视频的时间长度 */
        //         duration: -1,
        //         /** 视频的高度 */
        //         height: image.naturalHeight,
        //         /** 视频的宽度 */
        //         width: image.naturalWidth,
        //         /** 视频缩略图临时文件路径 */
        //         thumbTempFilePath: url
        //       })
        //       image.remove()
        //     }
        //     image.src = url;
        //   } else {
        //     // video
        //     const VideoEl = document.createElement('video');
        //     VideoEl.onloadedmetadata = function () {
        //       resolve({
        //         /** 本地临时文件路径 (本地路径) */
        //         tempFilePath: url,
        //         /** 本地临时文件大小，单位 B */
        //         size: item.size,
        //         /** 视频的时间长度 */
        //         duration: VideoEl.duration,
        //         /** 视频的高度 */
        //         height: VideoEl.videoHeight,
        //         /** 视频的宽度 */
        //         width: VideoEl.videoWidth,
        //         /** 视频缩略图临时文件路径 */
        //         thumbTempFilePath: ''
        //       })
        //       VideoEl.remove()
        //     }
        //     VideoEl.src = url;
        //   }
        // })
      })
    ).then(tempFiles => {
      res.tempFiles = tempFiles.slice(0, count)
      typeof success === 'function' && success(res)
      // typeof complete === 'function' && complete(res)
      taroChooseVideoCallback(res)
      taroChooseVideo!.value = ''
    })
  }
  return taroChooseVideoPromise
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
          return IMAGE_REGEXP.test(item.originalFileObj ? item.originalFileObj.name : item.path)
        })
          .filter(item => item.size > 0) // 夸克浏览器打开了相机又关闭但是不拍照的时候也会返回一个size0的图片，这里进行过滤
          .map(item => ({
            url: item.path,
            type: "image",
            thumb: item.path,
            name: item.originalFileObj ? item.originalFileObj.name : item.path,
            size: item.size,
          }))
      })
    case 'media':
      // Taro.chooseMedia 不支持 h5 拍摄或从手机相册中选择图片或视频。
      return chooseMedia({
        count: multiple ? Math.min(maxCount, 9) : 1,
        sourceType: capture,
        maxDuration,
        sizeType,
        camera,
      }).then(res => {
        console.log(res)
        return res.tempFiles.map((item) => ({
          url: item.tempFilePath,
          type: item.duration === -1 ? "image" : "video" as ("image" | "video"),
          thumb: item.thumbTempFilePath,
          name: item.thumbTempFilePath,
          size: item.size,
        }))
      })
    case "video":
      // 拍摄视频或从手机相册中选视频。
      // Taro.chooseVideo 这个api有问题，不是单选。
      return chooseVideo({
        sourceType: capture,
        compressed,
        maxDuration,
        camera,
      }).then((res: Taro.chooseVideo.SuccessCallbackResult) => {
        // console.log(res)
        return [{
          type: "video",
          url: res.tempFilePath,
          thumb: (res as any).thumbTempFilePath,
          // thumb: res.tempFilePath,
          size: res.size,
        }]
        // return VIDEO_REGEXP.test(res.tempFilePath) ? [{
        //   type: "video",
        //   url: res.tempFilePath,
        //   thumb: (res as any).thumbTempFilePath,
        //   // thumb: res.tempFilePath,
        //   size: res.size,
        // }] : []
      })
    default:
      // Taro.chooseMessageFile 选择文件：不支持h5
      return chooseMessageFile({
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
