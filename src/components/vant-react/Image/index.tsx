import Taro, { useState, useCallback, useMemo } from "@tarojs/taro";
import { Image, View } from "@tarojs/components";
import {
  useMemoCssProperties,
  useMemoAddUnit,
  useMemoClassNames,
  useMemoBem,
  noop,
  isH5,
  isWeapp,
} from "../common/utils";
import VanIcon from "../icon";
import "./index.less";

const FIT_MODE_MAP = {
  none: "center",
  fill: "scaleToFill",
  cover: "aspectFill",
  contain: "aspectFit",
  widthFix: "widthFix",
  heightFix: "heightFix",
} as const;
type sourceProps = React.ComponentProps<typeof Image>;
type VanImageProps = {
  ['custom-class']?: string;
  className?: string;
  ['loading-class']?: string;
  loadingClass?: string;
  ['error-class']?: string;
  errorClass?: string;
  ['image-class']?: string;
  imageClass?: string;
} & {
  type?: string;
  src?: sourceProps["src"];
  // fit?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  round?: boolean;
  lazyLoad?: boolean;
  showError?: boolean;
  showLoading?: boolean;
  useErrorSlot?: boolean;
  useLoadingSlot?: boolean;
  showMenuByLongpress?: boolean;
} & {
  renderLoading?: React.ReactNode;
  renderError?: React.ReactNode;
} & Pick<sourceProps, "onClick" | "onLoad" | "onError"> & {
  fit?: keyof typeof FIT_MODE_MAP;
} & Pick<sourceProps, "mode">;

const VanImage: Taro.FunctionComponent<VanImageProps> = (props) => {
  const {
    width,
    height,
    radius,
    round,
    fit = "fill",
    showError = true,
    showLoading = true,
  } = props;
  const css = useMemoCssProperties();
  const addUnit = useMemoAddUnit();
  const classnames = useMemoClassNames();
  const bem = useMemoBem();

  const mode = useMemo(() => {
    return props.mode ? props.mode : FIT_MODE_MAP[fit];
  }, [props.mode, fit]);
  const viewStyle = useMemo(() => {
    return css(
      radius
        ? {
            width: addUnit(width),
            height: addUnit(height),
            overflow: "hidden",
            borderRadius: addUnit(radius),
          }
        : {
            width: addUnit(width),
            height: addUnit(height),
          }
    );
  }, [width, height, radius]);
  const [data, setData] = useState({ loading: true, error: false });
  const onLoad = useCallback(
    (event: Parameters<NonNullable<sourceProps["onLoad"]>>[0]) => {
      setData({
        ...data,
        loading: false,
      });
      props.onLoad && props.onLoad(event);
    },
    [props.onLoad, data]
  );
  const onError = useCallback(
    (event: Parameters<NonNullable<sourceProps["onError"]>>[0]) => {
      setData({
        loading: false,
        error: true,
      });
      props.onError && props.onError(event);
    },
    [props.onLoad]
  );
  return (
    <View
      className={classnames(
        isH5 && props.className,
        isWeapp && 'custom-class',
        bem("image", { round })
      )}
      style={viewStyle}
      onClick={props.onClick || noop}
    >
      {!data.error && (
        <Image
          src={props.src || ""}
          mode={mode}
          lazyLoad={props.lazyLoad}
          className={classnames(
            isH5 && props.imageClass,
            isWeapp && "image-class",
            "van-image__img"
          )}
          showMenuByLongpress={props.showMenuByLongpress}
          onLoad={onLoad}
          onError={onError}
        />
      )}
      {showLoading && data.loading && (
        <View className={classnames(
          isH5 && props.loadingClass,
          isWeapp && "loading-class",
          "van-image__loading")
        }>
          {props.useLoadingSlot ? (
            props.renderLoading
          ) : (
            <VanIcon name="photo-o" size="22" />
          )}
        </View>
      )}
      {showError && data.error && (
        <View className={classnames(
          isH5 && props.errorClass,
          isWeapp && "error-class",
          "van-image__error"
        )}>
          {props.useErrorSlot ? (
            props.renderError
          ) : (
            <VanIcon name="warning-o" size="22" />
          )}
        </View>
      )}
    </View>
  );
};
VanImage.options = {
  addGlobalClass: true,
}

VanImage.externalClasses = [
  'custom-class',
  'loading-class',
  'error-class',
  'image-class'
]
export default VanImage;
