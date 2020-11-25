import Nerv from "nervjs";
import Taro, { useEffect, useState } from "@tarojs/taro";
import VanNavBar from "src/components/vant-react/NavBar";
import "./mocknative.less"
import { getCurrentPage, isH5 } from "src/components/vant-react/common/utils";
function MockNav() {
  const [page, setPage] = useState<any>({})

  useEffect(() => {
    const page = getCurrentPage();
    if (page) {
      const options = {
        ...page.$app.config.window,
        ...page.config,
      }
      console.log(options.navigationBarTitleText)
      setPage(options)
    }

    window.addEventListener("hashchange", function () {
      console.log("location: " + document.location );

      const page = getCurrentPage();

      if (page) {
        const options = {
          ...page.$app.config.window,
          ...page.config,
        }
        setPage(options)
      }
    })
    window.addEventListener('popstate', (event) => {
      console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
    });

  }, [])
  return <VanNavBar
    title={page.navigationBarTitleText}
    leftArrow={true}
    onClickLeft={() => Taro.navigateBack()}
  ></VanNavBar>
}

if (isH5) {
  window.addEventListener("load", function () {
    const app = document.getElementById("app");
    app!.style.display = "flex"
    const navcontainer = document.createElement("div");
    navcontainer.id = "app_nav"
    app!.insertAdjacentElement('afterbegin', navcontainer)
    Nerv.render(
      <MockNav />, navcontainer
    )
  })
}
