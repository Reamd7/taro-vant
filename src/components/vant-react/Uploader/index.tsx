import Taro from '@tarojs/taro';
import { useMemo, useCallback } from '@tarojs/taro' /** api **/;
import "./index.less";
import { ImageProps } from '@tarojs/components/types/Image';
import VanIcon, { VanIconProps } from '../icon';
import { View, Video, Text, Block, Image } from '@tarojs/components';
import { useMemoAddUnit, useMemoClassNames, ActiveProps } from '../common/utils';
import VanLoading from '../Loading';
import { chooseFile } from './utils';

interface BaseType {
  // 文件名称、视频将在全屏预览时作为标题显示
  name?: string
  // 是否可删除
  deletable?: boolean;
  // 上传状态
  status?: "uploading" | "failed" | string;
  message?: string

  size: number;
}
export interface VanFileType extends BaseType {
  type: "file"
  url?: string
}

export interface VanImageType extends BaseType {
  // 图片的网络资源地址
  url: string
  type: "image";
  // 图片缩略图或视频封面的网络资源地址，仅对图片和视频有效
  thumb: string
}

export interface VanVideoType extends BaseType {
  // 视频的网络资源地址
  url: string
  type: "video";
  // 图片缩略图或视频封面的网络资源地址，仅对图片和视频有效
  thumb: string;
  autoplay?: boolean
}

export type VanUploaderProps = {
  FileList?: Array<VanFileType | VanImageType | VanVideoType>

  /**
   * 标识符，可以在回调函数的第二项参数中获取
   */
  name?: string | number;
  /**
    * 接受的文件类型, 可选值为all media image file video
    * - media	图片和视频
    * - image	图片
    * - video	视频
    * - file	从客户端会话选择图片和视频以外的文件
    * - all	从客户端会话选择所有文件
   */
  accept?: "all" | "media" | "image" | "file" | "video"
  /**
   * 所选的图片的尺寸, 当accept为image类型时设置所选图片的尺寸可选值为original compressed
   */
  sizeType?: NonNullable<
    Parameters<typeof Taro.chooseMedia>[0]
  >['sizeType']
  /**
   * 预览图和上传区域的尺寸，默认单位为px
   */
  previewSize?: number | string;
  /**
   * 是否在上传完成后展示预览图
   */
  previewImage?: boolean;
  /**
   * 是否在点击预览图后展示全屏图片预览
   */
  previewFullImage?: boolean;
  /**
   * 是否开启图片多选，部分安卓机型不支持
   */
  multiple?: boolean;
  /**
   * 是否禁用文件上传
   */
  disabled?: boolean
  /**
   * 是否展示文件上传按钮
   */
  showUpload?: boolean;
  /**
   * 是否展示删除按钮
   */
  deletable?: boolean;
  /**
   * 图片或者视频选取模式，当accept为image类型时设置capture可选值为camera可以直接调起摄像头
   */
  capture?: NonNullable<
    Parameters<typeof Taro.chooseMedia>[0]
  >['sourceType']
  /**
   * 文件大小限制，单位为byte
   */
  maxSize?: number;
  /**
   * 文件上传数量限制
   */
  maxCount?: number;
  /**
   * 上传区域文字提示
   */
  uploadText?: string;
  /**
   * 预览图裁剪模式，可选值参考小程序image组件的mode属性
   */
  imageFit?: ImageProps['mode']
  /**
   * 是否开启文件读取前事件
   */

  /**
   * 当 accept 为 video 时生效，可选值为 back front
   */
  camera?: 'back' | 'front';
  /**
   * 	当 accept 为 video 时生效，是否压缩视频，默认为true
   */
  compressed?: NonNullable<
    Parameters<typeof Taro.chooseVideo>[0]
  >['compressed']
  /**
   * 当 accept 为 video 时生效，是否压缩视频，默认为true
   */
  maxDuration?: NonNullable<
    Parameters<typeof Taro.chooseVideo>[0]
  >['maxDuration']
  /**
   * 上传区域图标，可选值见 Icon 组件
   */
  uploadIcon?: VanIconProps['name']

  children?: React.ReactNode
} & {
  onBeforeRead?: (file: VanUploaderFile[]) => (
    VanUploaderFile[] | Promise<VanUploaderFile[]>
  );

  onAfterRead?: (file: VanUploaderFile[]) => void;

  onOversize?: (file: VanUploaderFile[]) => void;

  onClickPreview?: (event: {
    index: number;
    file: VanUploaderFile;
  }) => void;

  onDelete?: (event: {
    index: number;
    file: VanUploaderFile;
  }) => void;

  onError?: (error: any) => void
}

export type VanUploaderFile = NonNullable<VanUploaderProps['FileList']>[number]

const DefaultProps = {
  name: '',
  accept: "image",

  previewSize: 80,
  previewImage: true,
  previewFullImage: true,
  multiple: false,
  disabled: false,
  showUpload: true,
  deletable: true,
  imageFit: 'scaleToFill',
  uploadIcon: 'photograph',
  maxSize: Number.MAX_VALUE,
  maxCount: 100,

  sizeType: ['original', 'compressed'],
  capture: ['album', 'camera'],

  compressed: true,
  maxDuration: 60,
  camera: 'back',

  FileList: []
} as const

export type ActiveVanUploaderProps = ActiveProps<VanUploaderProps, keyof typeof DefaultProps>;

const VanUploader: Taro.FunctionComponent<VanUploaderProps> = (props: ActiveVanUploaderProps) => {
  const lists = useMemo(() => {
    return props.FileList || []
  }, [props.FileList]);

  const isInCount = useMemo(() => {
    return lists.length < props.maxCount
  }, [props.maxCount, lists])

  const addUnit = useMemoAddUnit();
  const classNames = useMemoClassNames();

  const listItemStyle = useMemo(() => ({
    width: addUnit(props.previewSize),
    height: addUnit(props.previewSize)
  }), [addUnit, props.previewSize]);

  const startUpload = useCallback(() => {
    const { maxCount, multiple, disabled } = props;
    if (disabled) return;

    chooseFile({
      accept: props.accept,
      multiple,
      capture: props.capture,
      compressed: props.compressed,
      maxDuration: props.maxDuration,
      sizeType: props.sizeType,
      camera: props.camera,
      maxCount: maxCount - lists.length,
    }).then(async file => {
      const { onBeforeRead } = props;
      if (
        onBeforeRead !== undefined
      ) {
        file = await onBeforeRead(file);
      }
      const result = !!file.length;
      if (!result) {
        return;
      }

      // ====================================
      const oversize = file.some((item) => item.size > props.maxSize);
      if (oversize && props.onOversize) {
        props.onOversize(file)
        return;
      }
      if (props.onAfterRead !== undefined) {
        props.onAfterRead(file)
      }
    }).catch((error) => {
      props.onError && props.onError(error)
    });
  }, [lists, props]);

  const deleteItem = useCallback((index: number) => {
    if (props.onDelete) {
      props.onDelete({
        index: index,
        file: lists[index]
      });
    }
  }, [props.onDelete, lists]);

  const onPreviewImage = useCallback((index: number) => {
    if (!props.previewFullImage) return;
    Taro.previewImage({
      urls: lists.filter((item) => item.type === "image").map((item) => item.url || ''),
      current: lists[index].url,
      // success: (res) => {
      //   console.log(res)
      // },
      fail: () => {
        Taro.showToast({
          title: '预览图片失败', icon: 'none'
        })
      }
    })
  }, [props.previewFullImage, lists])

  const onPreviewVideo = useCallback((index: number) => {
    if (process.env.TARO_ENV === "weapp") {
      if (!props.previewFullImage) return;
      wx.previewMedia({
        sources: lists
          .filter((item) => item.type === "video")
          .map((item) => ({
            ...item as VanVideoType,
            type: 'video',
          })),
        current: index,
        fail() {
          wx.showToast({ title: '预览视频失败', icon: 'none' });
        },
      });
    }
  }, [props.previewFullImage, lists]);

  const onClickPreview = useCallback((index: number) => {
    if (props.onClickPreview) {
      props.onClickPreview({
        index,
        file: lists[index]
      })
    }
  }, [lists, props.onClickPreview])

  return <View className="van-uploader">
    <View className="van-uploader__wrapper">
      {/* <!-- 预览样式 --> */}
      {props.previewImage && (
        lists.map((item, index) => {
          return <View
            className="van-uploader__preview"
            data-index={index}
            key={index}
            onClick={() => onClickPreview(index)}
          >
            {(item.type === "image") ?
              <Image
                mode={props.imageFit}
                src={item.thumb || item.url}
                data-alt={item.name || ('图片' + index)}
                className="van-uploader__preview-image"
                style={listItemStyle}
                data-index={index}
                onClick={() => onPreviewImage(index)}
              />
              : (item.type === "video") ?
                (<Video
                  src={item.url}
                  title={item.name || ('视频' + index)}
                  poster={item.thumb}
                  autoplay={item.autoplay}
                  className="van-uploader__preview-image"
                  style={listItemStyle}
                  data-index={index}
                  onClick={() => onPreviewVideo(index)}
                />) :
                (<View
                  className="van-uploader__file"
                  style={listItemStyle}
                >
                  <VanIcon name="description" className="van-uploader__file-icon" />
                  <View className="van-uploader__file-name van-ellipsis">
                    {item.name || item.url}
                  </View>
                </View>)
            }
            {(item.status === 'uploading' || item.status === 'failed') &&
              <View className="van-uploader__mask" >
                {item.status === 'failed' ?
                  <VanIcon
                    name="close"
                    className="van-uploader__mask-icon" custom-class="van-uploader__mask-icon"
                  /> :
                  <VanLoading custom-class="van-uploader__loading" />
                }
                {item.message &&
                  <Text className="van-uploader__mask-message">
                    {item.message}
                  </Text>
                }
              </View>}
            {(props.deletable && item.deletable !== false) &&
              <View
                data-index={index}
                className="van-uploader__preview-delete"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteItem(index)
                }}
              >
                <VanIcon
                name="cross" className="van-uploader__preview-delete-icon" custom-class="van-uploader__preview-delete-icon" />
              </View>
            }

          </View>
        })
      )}
      {/* <!-- 上传样式 --> */}
      {isInCount && <Block>
        <View
          className="van-uploader__slot"
          onClick={startUpload}
        >
          {props.children}
        </View>
        {/* <!-- 默认上传样式 --> */}
        {props.showUpload && <View
          className={classNames(
            "van-uploader__upload",
            props.disabled && 'van-uploader__upload--disabled'
          )}
          style={listItemStyle}
          onClick={startUpload}
        >
          <VanIcon
            name={props.uploadIcon}
            className="van-uploader__upload-icon"
            custom-class="van-uploader__upload-icon"
          />
          {props.uploadText &&
            <Text className="van-uploader__upload-text">{props.uploadText}</Text>
          }
        </View>}
      </Block>
      }
    </View >
  </View >
}

VanUploader.options = {
  addGlobalClass: true
}

VanUploader.defaultProps = DefaultProps as any

export default VanUploader;
