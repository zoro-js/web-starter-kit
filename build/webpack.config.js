/*
* @Author: Zhang Yingya(hzzhangyingya)
* @Date:   2016-05-16 21:15:10
* @Last modified by:   zyy
* @Last modified time: 2016-06-23 13:54:01
*/

var env = require('./env')
var fs = require('fs-extra')
var path = require('path')
var webpack = require('webpack')
// var HtmlWebpackPlugin = require('html-webpack-plugin')

function genEntry () {
  var entryDir = path.resolve(__dirname, '../src/js/entry')
  var filenameList = fs.readdirSync(entryDir)
  var entry = {}
  filenameList.forEach(function (filename) {
    var index = filename.lastIndexOf('.')
    if (index === filename.length - 3) {
      var name = filename.slice(0, index)
      entry[name] = path.resolve(entryDir, filename)
    }
  })
  return entry
}

var config = {
  entry: genEntry(),
  output: {
    path: path.resolve(__dirname, '../dist/js'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /\.html$/, loader: 'raw' },
      { test: /\.yaml$/, loader: 'json!yaml' }
    ]
  },
  resolve: {
    root: [
      path.resolve(__dirname, '../src/js')
    ],
    alias: {
      'data': path.resolve(__dirname, '../data'),
      'strap': path.resolve(__dirname, '../src/submodule/regular-strap/src'),
      'zoro-base': path.resolve(__dirname, '../src/submodule/zoro-base/src'),
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
    }),
    new webpack.optimize.CommonsChunkPlugin('common.js')
  ]
}

// http://webpack.github.io/docs/build-performance.html

/*
 * - Only use optimization plugins in production builds. https://webpack.github.io/docs/optimization.html
 *   - OccurrenceOrderPlugin: Webpack can vary the distribution of the ids to get the smallest id length for often used ids. The entry chunks have higher priority for file size.
 * 	 - UglifyJsPlugin: minimize your scripts https://github.com/mishoo/UglifyJS2#usage
 *     - UglifyJS will warn about the condition being always false and about dropping unreachable code; for now there is no option to turn off only this specific warning, you can pass warnings=false to turn off all warnings.
 *     - The UglifyJsPlugin uses SourceMaps to map errors to source code. And SourceMaps are slow.
 *     - DedupePlugin: If you use some libraries with cool dependency trees, it may occur that some files are identical. Webpack can find these files and deduplicate them. This feature adds some overhead to the entry chunk.
 *     - LimitChunkCountPlugin: Limit the chunk count to a defined value. Chunks are merged until it fits.
 *     - MinChunkSizePlugin: Merge small chunks that are lower than this min size (in chars). An ASCII character in 8-bit ASCII encoding is 8 bits (1 byte).
 * - TODO
 *   - optimization
 *     - Single-Page-App
 *     - Multi-Page-App
 *       - https://github.com/webpack/webpack/tree/master/examples/multiple-entry-points
 *       - https://github.com/webpack/webpack/tree/master/examples/multiple-commons-chunks
 *     - DYNAMIC LINKED LIBRARY
 *   - build-performance
 *     - prefetch
 *   - 除了 /src/js 之外的其他 JS 如何 watch 并 lint
 *   - hash 在 publish 的时候生成 hash
 *   - HtmlWebpackPlugin https://github.com/ampedandwired/html-webpack-plugin
 */

var isProduction = env.isProduction()
if (!isProduction) {
  // sourceMap 相关
  config.output.pathinfo = true
  config.devtool = 'eval'
} else {
  [].push.apply(config.plugins, [
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
  ])
}

module.exports = config
