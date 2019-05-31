let path = require('path')
let webpack = require('webpack')
let WebpackMerge = require('webpack-merge')
let ExtractTextPlugin = require('extract-text-webpack-plugin')
let OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
let entry = require('./entry')

let devConfig = {
  entry: entry,
  output: {
    path: path.resolve(__dirname, `../lib`),
    publicPath: '../',
    pathinfo: true,
    filename: `[name].js`,
    library: `element-common-form`,
    libraryTarget: 'umd'
  },
  externals: {
    vue: 'vue'
  },
  module: {
    rules: [{
      test: /\.(js|vue)$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      include: path.resolve(__dirname, '../src'),
      options: {
        formatter: require('eslint-friendly-formatter')
      }
    },
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          css: ExtractTextPlugin.extract({
            use: 'css-loader',
            fallback: 'vue-style-loader'
          }),
          less: ExtractTextPlugin.extract({
            use: ['css-loader', 'less-loader'],
            fallback: 'vue-style-loader'
          })
        },
        transformToRequire: {
          video: 'src',
          source: 'src',
          img: 'src',
          image: 'xlink:href'
        }
      }
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: 'css-loader'
      })
    },
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      options: {
        presets: ['es2015']
     }
    },
    {
      test: /\.(png|jpg|gif|svg)$/i,
      use: [
        'url-loader?limit=1024000', // 图片默认全部 inline
        'img-loader'
      ]
    }]
  },
  plugins: [
    new ExtractTextPlugin('[name].css')
  ],
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      // 'vue$': 'vue/dist/vue.common.js',
      '@': path.resolve(__dirname, '../src')
    }
  },
  devtool: '#eval-source-map'
}

module.exports = devConfig

if (process.env.NODE_ENV === 'production') {
  module.exports = WebpackMerge(devConfig, {
    output: {
      pathinfo: false
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"'
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
          warnings: false
        }
      }),
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          reduceIdents: false,
          autoprefixer: false,
          zindex: false
        }
      })
    ],
    performance: {
      hints: 'error',
      maxEntrypointSize: 600000,
      maxAssetSize: 600000
    },
    devtool: ''
  })
}

if (process.env.NODE_ENV === 'testing') {
  // no need for app entry during tests
  delete devConfig.entry
  module.exports = WebpackMerge(devConfig, {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"testing"'
        }
      })
    ],
    devtool: '#inline-source-map'
  })
}
