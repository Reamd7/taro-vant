const path = require('path');
const glob = require('glob');

const SRC = path.resolve(__dirname, '..', 'src')
const DIST = path.resolve(__dirname, '..', `dist/${process.env.TARO_ENV}`)
const wxsPattern = glob.sync("**/*.wxs", { cwd: SRC, mark: true }).map(file => {
  return {
    from: path.resolve(SRC, file), to: path.resolve(DIST, file)
  }
});
const node_modules = path.resolve(__dirname, "..", "node_modules")
// console.log(path.resolve(node_modules, '@tarojs/taro'))
// TARO_ENV: "weapp" | "swan" | "alipay" | "h5" | "rn" | "tt" | "quickapp" | "qq"

const config = {
  projectName: 'myshop',
  date: '2020-9-19',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: `dist/${process.env.TARO_ENV}`,
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
    'src': path.resolve(__dirname, '..', 'src')
  },
  copy: {
    // patterns: [
    //   { from: 'src/components/vant-react/Slider/slider.wxs', to: 'dist/components/vant-react/Slider/slider.wxs' },
    //   { from: 'src/components/vant-react/Overlay/overlay.wxs', to: 'dist/components/vant-react/Overlay/overlay.wxs' }
    // ],
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

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
