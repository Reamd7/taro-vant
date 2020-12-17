const path = require('path');
const glob = require('glob');
const cwd = process.cwd();
const SRC = path.resolve(cwd, 'src')
const DIST = path.resolve(cwd, `dist/${process.env.TARO_ENV}`)
const wxsPattern = glob.sync("**/*.wxs", { cwd: SRC, mark: true }).map(file => {
  return {
    from: path.resolve(SRC, file), to: path.resolve(DIST, file)
  }
});
const node_modules = path.resolve(__dirname, "..", "node_modules")
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
    'taro-vant': path.resolve(__dirname, '..', 'src/components/taro-vant')
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
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
