const path = require('path');
const glob = require('glob');
const fs = require('fs-extra');
const chokidar = require("chokidar");
const cwd = process.cwd();
const SRC = path.resolve(cwd, 'src')
const DIST = path.resolve(cwd, `dist/${process.env.TARO_ENV}`)

// =======================
console.log("复制 taro-vant")
const sourceTaroVant = path.resolve(cwd, "../taro-vant");
const destTaroVant = path.resolve(SRC, "./components/.temp/taro-vant")
fs.removeSync(destTaroVant);
fs.copySync(sourceTaroVant, destTaroVant, {
  overwrite: true,
  preserveTimestamps: true,
  filter: (src, dest) => {
    if (src.includes("node_modules")) {
      console.log(src, dest)
      return false;
    }
    return true;
  }
});
if (!isBuildComponent) {
  console.log("监听 taro-vant");
  const watcher = chokidar.watch(sourceTaroVant, {
    cwd: sourceTaroVant,
    ignored: /node_modules/,
    depth: Infinity,
    ignoreInitial: true
  });
  watcher.add('.');
  watcher
    .on("add", (filename, stat) => {
      fs.copy(
        path.resolve(sourceTaroVant, filename),
        path.resolve(destTaroVant, filename),
        {
          overwrite: true,
          preserveTimestamps: true,
        }
      )
      console.log(new Date(), "add", filename, stat?.mtimeMs)
    })
    .on("unlink", (filename, stat) => {
      fs.removeSync(path.resolve(destTaroVant, filename))
      console.log(new Date(), "unlink", filename, stat?.mtimeMs)
    })
    .on("addDir", (filename, stat) => {
      fs.copySync(
        path.resolve(sourceTaroVant, filename),
        path.resolve(destTaroVant, filename),
        {
          overwrite: true,
          preserveTimestamps: true,
        }
      )
      console.log(new Date(), "addDir", filename, stat?.mtimeMs)
    })
    .on("unlinkDir", (filename, stat) => {
      fs.removeSync(path.resolve(destTaroVant, filename))
      console.log(new Date(), "unlinkDir", filename, stat?.mtimeMs)
    })
    .on("change", (filename, stat) => {
      fs.copy(
        path.resolve(sourceTaroVant, filename),
        path.resolve(destTaroVant, filename),
        {
          overwrite: true,
          preserveTimestamps: true,
        }
      )
      console.log(new Date(), "change", filename, stat?.mtimeMs)
    })
    // .on("ready", function() {
    //   console.log("ready", arguments)
    // })
    // .on("raw", (event, filename, stat) => {
    //   console.log("raw:" + new Date(), event, filename, stat?.mtimeMs)
    // })

  // console.log(watcher.getWatched())
}
// =======================

const wxsPattern = glob.sync("**/*.wxs", { cwd: SRC, mark: true }).map(file => {
  return {
    from: path.resolve(SRC, file), to: path.resolve(DIST, file)
  }
}).concat(
  glob.sync("**/*.wxs", { cwd: sourceTaroVant, mark: true }).map(file => {
    return {
      from: path.resolve(sourceTaroVant, file), to: path.resolve(DIST, "./components/.temp/taro-vant", file)
    }
  })
);

console.log(wxsPattern);
// const node_modules = path.resolve(__dirname, "..", "node_modules")
// console.log(path.resolve(node_modules, '@tarojs/taro'))
// TARO_ENV: "weapp" | "swan" | "alipay" | "h5" | "rn" | "tt" | "quickapp" | "qq"
const isBuildComponent = process.env.TARO_BUILD_TYPE === 'component'

const config = {
  projectName: 'taro-vant',
  date: '2020-9-19',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: isBuildComponent ? 'ui' : `dist/${process.env.TARO_ENV}`,
  babel: {
    sourceMap: true,
    presets: [
      ['env', {
        modules: false
      }]
    ],
    plugins: [
      'transform-decorators-legacy',
      'transform-class-properties',
      'transform-object-rest-spread',
      ['transform-runtime', {
        'helpers': false,
        'polyfill': false,
        'regenerator': true,
        'moduleName': 'babel-runtime'
      }]
    ]
  },
  plugins: [
    '@tarojs/plugin-less',
    '@tarojs/plugin-terser'
  ],
  defineConstants: {
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 10240 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: [
            'last 3 versions',
            'Android >= 4.1',
            'ios >= 8'
          ]
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  alias: {
    'src': path.resolve(__dirname, '..', 'src'),
    'taro-vant': path.resolve(SRC, "./components/.temp/taro-vant")
  },
  copy: {
    patterns: wxsPattern,
    options: {
      ignore: ['*.js', '*.jsx', '*.ts', "*.tsx", "*.css", "*.less", "*.scss"]
    }
  },
  terser: {
    enable: process.env.TARO_ENV !== "h5",
    config: {
      ecma: 2015
    }
  },
  csso: {
    enable: process.env.TARO_ENV !== "h5",
  }
}

if (isBuildComponent) {
  Object.assign(config.h5, {
    enableSourceMap: false,
    enableExtract: false,
    enableDll: false
  })
  config.h5.webpackChain = chain => {
    chain.plugins.delete('htmlWebpackPlugin')
    chain.plugins.delete('addAssetHtmlWebpackPlugin')
    chain.merge({
      output: {
        path: path.join(process.cwd(), 'dist', 'h5'),
        filename: 'index.js',
        libraryTarget: 'umd',
        library: 'taro-vant'
      },
      externals: {
        nervjs: 'commonjs2 nervjs',
        classnames: 'commonjs2 classnames',
        '@tarojs/components': 'commonjs2 @tarojs/components',
        '@tarojs/taro-h5': 'commonjs2 @tarojs/taro-h5',
        'weui': 'commonjs2 weui',

        "throttle-debounce": 'commonjs2 throttle-debounce',
        "big.js": 'commonjs2 big.js',
        "dayjs": 'commonjs2 dayjs'
      },
      plugin: {
        extractCSS: {
          plugin: MiniCssExtractPlugin,
          args: [{
            filename: 'css/index.css',
            chunkFilename: 'css/[id].css'
          }]
        }
      }
    })
  }
}
module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({},
      config, require('./dev'),
      require('taro-vant/plugin')({
        tempPath: "components/.temp", // 在src下的临时文件路径，必须是相对路径 src/components/.temp
        modules: {
          // "taro-vant": "src/components/taro-vant" // node_module/taro-vant/src/components/taro-vant, // 兼容各种类型的node模块，我是从npm 安装 git 模块中的需求中发现这个需求的
          // "taro-vant": "" // node_module/taro-vant
          // "taro-vant": "." // node_module/taro-vant
        }, // 需要inline编译的library => 模块的根目录
        copySrcWxs: true // 内联一个功能，是否复制src项目编写的wxs文件
      })
    )
  }
  return merge({},
    config, require('./prod'),
    require('taro-vant/plugin')({
      tempPath: "components/.temp",
      modules: {
        // "taro-vant": "src/components/taro-vant" // node_module/taro-vant/src/components/taro-vant
        // "taro-vant": "" // node_module/taro-vant
        // "taro-vant": "." // node_module/taro-vant
      },
      copySrcWxs: true
    })
  )
}
