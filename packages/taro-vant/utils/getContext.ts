import { getCurrentPage } from "./getCurrentPage";

export function getContext() {
  const page = getCurrentPage();
  if (page) {
    if (process.env.TARO_ENV === "h5") {
      return page.$router.path // TODO 坑
    }
    return page.route
  } else {
    return null;
  }
}
