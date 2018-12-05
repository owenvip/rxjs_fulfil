const path = require('path')
const webpack = require('webpack')
const HappyPack = require('happypack')
const HTMLPlugin = require('html-webpack-plugin')
const history = require('connect-history-api-fallback')
const convert = require('koa-connect')
const internalIp = require('internal-ip') // 开发环境允许其他电脑访问

const dev = Boolean(process.env.WEBPACK_SERVE)

module.exports = {
  mode: dev ? 'development' : 'production',
  entry: {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, '../src/index.js')
    ]
  },
  output: {
    filename: dev ? '[name].js' : '[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.join(__dirname, '../dist'),
    publicPath: '/assets/'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx'],
    alias: {
      '~': path.join(__dirname, '../src')
    }
  },
  module: {
    rules: [
      /* {
        enforce: 'pre',
        test: /.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: [
          path.resolve(__dirname, '../node_modules')
        ]
      }, */
      {
        test: /.js$/,
        use: ['happypack/loader?id=babel'],
        include: path.resolve(__dirname, '../src'),
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      },
      {
        test: /\.less|css$/,
        use: [
          {
            loader: 'style-loader' // creates style nodes from JS strings
          },
          {
            loader: 'css-loader' // translates CSS into CommonJS
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              modifyVars: {
                'font-size-base': '14px'
              }
            } // compiles Less to CSS
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          {
            loader: 'image-webpack-loader',
            options: {
              progressive: true,
              optimizationLevel: 7,
              interlaced: false,
              pngquant: {
                quality: '65-90',
                speed: 4
              }
            }
          }
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../src/index.html'),
      chunksSortMode: 'none'
    }),
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'babel',
      // 如何处理 .js 文件，用法和 Loader 配置中一样
      loaders: ['babel-loader?cacheDirectory']
      // ... 其它配置项
    }),
    new webpack.HashedModuleIdsPlugin()
  ],
  optimization: {
    /*
    上面提到 chunkFilename 指定了 chunk 打包输出的名字，那么文件名存在哪里了呢？
    它就存在引用它的文件中。这意味着一个 chunk 文件名发生改变，会导致引用这个 chunk 文件也发生改变。

    runtimeChunk 设置为 true, webpack 就会把 chunk 文件名全部存到一个单独的 chunk 中，
    这样更新一个文件只会影响到它所在的 chunk 和 runtimeChunk，避免了引用这个 chunk 的文件也发生改变。
    */
    runtimeChunk: true,

    splitChunks: {
      /*
      默认 entry 的 chunk 不会被拆分
      因为我们使用了 html-webpack-plugin 来动态插入 <script> 标签，entry 被拆成多个 chunk 也能自动被插入到 html 中，
      所以我们可以配置成 all, 把 entry chunk 也拆分了
      */
      chunks: 'all'
    }
  },
  performance: {
    hints: dev ? false : 'warning'
  }
}

if (dev) {
  module.exports.serve = {
    port: 8082,
    host: '0.0.0.0',
    hot: {
      host: {
        client: internalIp.v4.sync(),
        server: '0.0.0.0'
      }
    },
    dev: {
      /*
      指定 webpack-dev-middleware 的 publicpath
      一般情况下与 output.publicPath 保持一致（除非 output.publicPath 使用的是相对路径）
      https://github.com/webpack/webpack-dev-middleware#publicpath
      */
      publicPath: '/assets/'
    },
    add: app => {
      app.use(convert(history({
        index: '/assets/', // index.html 文件在 /assets/ 路径下
        disableDotRule: true,
        htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'] // 需要配合 disableDotRule 一起使用
      })))
    }
  }
}
