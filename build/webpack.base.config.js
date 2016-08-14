/**
* @Author: Zhang Yingya(hzzhangyingya) <zyy>
* @Date:   2016-08-06T17:13:40+08:00
* @Email:  zyy7259@gmail.com
* @Last modified by:   zyy
* @Last modified time: 2016-08-06T19:31:02+08:00
*/

var env = require('./env')
var path = require('path')
var webpack = require('webpack')

var config = {
  module: {
    loaders: [
      {test: /\.html$/, loader: 'raw'},
      {test: /\.yaml$/, loader: 'json!yaml'},
      {test: /\.css$/, loader: 'style!css!postcss'},
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: [
            ['es2015', {'loose': true, 'modules': 'commonjs'}],
            ['stage-3']
          ],
          cacheDirectory: true,
          plugins: [
            'add-module-exports',
            'transform-es3-property-literals',
            'transform-es3-member-expression-literals'
          ]
        }
      }
    ]
  },
  resolve: {
    alias: {
      'data': path.resolve(__dirname, '../data'),
      'zoro-base': path.resolve(__dirname, '../submodule/zoro-base/src'),
      'regularjs': path.resolve(__dirname, '../node_modules/regularjs/dist/regular'),
      'restate': path.resolve(__dirname, '../node_modules/regular-state/restate-full'),
      'stateman': path.resolve(__dirname, '../node_modules/stateman/stateman')
    },
    extensions: ['', '.js', '.json', '.yaml']
  },
  plugins: [
    new webpack.ProvidePlugin({
      Regular: 'regularjs',
      restate: 'restate',
      _: 'lodash'
    })
  ]
}

var isProduction = env.isProduction()
if (!isProduction) {
  // sourceMap 相关
  config.output.pathinfo = true
  config.devtool = 'eval'
} else {
  config.optimizePlugins = [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
    new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000})
  ]
}

module.exports = config
