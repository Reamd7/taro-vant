import Taro, { useState, useCallback, useMemo } from "@tarojs/taro";
import { Image, View } from "@tarojs/components";
import {
  useMemoCssProperties,
  useMemoAddUnit,
  useMemoClassNames,
  useMemoBem,
  noop,
  isNormalClass,
  isExternalClass,
} from "../common/utils";
import VanIcon from "../icon";
import "./index.less";

const FIT_MODE_MAP = {
  none: undefined,
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
  bgColor?: string

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

  clip?: [number, number]
}
//  & Pick<sourceProps, "mode">;

const VanImage: Taro.FunctionComponent<VanImageProps> = (props) => {
  const {
    width = 320,
    height = 240,
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

  const mode = useMemo(() => FIT_MODE_MAP[fit], [fit]);

  const containerStyle = useMemo(() => {
    return css(
      radius
        ? {
          width: addUnit(width),
          height: addUnit(height),
          borderRadius: addUnit(radius),
          backgroundColor: props.bgColor
        }
        : {
          width: addUnit(width),
          height: addUnit(height),
          backgroundColor: props.bgColor
        }
    );
  }, [width, height, radius, props.bgColor]);
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
        isNormalClass && props.className,
        isExternalClass && 'custom-class',
        bem("image", { round })
      )}
      style={containerStyle}
      onClick={props.onClick || noop}
    >
      {!data.error && (
        <Image
          src={props.src || ""}
          mode={mode}
          lazyLoad={props.lazyLoad}
          className={classnames(
            isNormalClass && props.imageClass,
            isExternalClass && "image-class",
            "van-image__img",
            props.fit && (
              FIT_MODE_MAP[props.fit] && `van-image__img--${FIT_MODE_MAP[props.fit]}`
            )
          )}
          showMenuByLongpress={props.showMenuByLongpress}
          onLoad={onLoad}
          onError={onError}
        />
      )}
      {showLoading && data.loading && (
        <View className={classnames(
          isNormalClass && props.loadingClass,
          isExternalClass && "loading-class",
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
          isNormalClass && props.errorClass,
          isExternalClass && "error-class",
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
