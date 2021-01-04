import Taro from "@tarojs/taro";

import "./index.less";
import { useMemoClassNames, isExternalClass, isNormalClass } from "../utils"
import { View } from "@tarojs/components";
import VanCell from "../Cell";

export type VanPanelProps = {
  desc?: string;
  title?: string;
  status?: string;
  useFooterSlot?: boolean;

  headerClass?: string;
  ["header-class"]?: string;

  ["footer-class"]?: string;
  footerClass?: string;

  ["custom-class"]?: string;
  className?: string;

  renderHeader?: React.ReactNode;
  renderFooter?: React.ReactNode;
};

const VanPanel: Taro.FunctionComponent<VanPanelProps> = props => {
  const { desc, title, status, useFooterSlot = false } = props;
  const classnames = useMemoClassNames();
  return (
    <View
      className={classnames(
        "van-panel van-hairline--top-bottom",
        isNormalClass && props.className,
        isExternalClass && props["custom-class"]
      )}
    >
      {title || desc || status ? (
        <VanCell
          title={title}
          label={desc}
          value={status}
          custom-class="header-class"
          className="header-class"
          value-class="van-panel__header-value"
          valueClass="van-panel__header-value"
        />
      ) : (
        props.renderHeader
      )}
      <View className="van-panel__content">{props.children}</View>
      {useFooterSlot && (
        <View
          className={classnames(
            "van-panel__footer van-hairline--top",
            isExternalClass && "footer-class",
            isNormalClass && props.footerClass
          )}
        >
          {props.renderFooter}
        </View>
      )}
    </View>
  );
};

VanPanel.options = {
  addGlobalClass: true
};

VanPanel.externalClasses = ["header-class", "footer-class", "custom-class"];

export default VanPanel;
