/*
* @Author: Zhang Yingya(hzzhangyingya)
* @Date:   2016-05-16 21:15:10
* @Last modified by:   zyy
* @Last modified time: 2016-08-06T17:26:19+08:00
*/

var env = require('./env')
var webpack = require('webpack')
var fs = require('fs-extra')
var path = require('path')
// var HtmlWebpackPlugin = require('html-webpack-plugin')

var config = require('./webpack.config.base.js')

function genEntry () {
  var entryDir = path.join(process.cwd(), 'src/js/entry')
  var filenameList = fs.readdirSync(entryDir)
  var entry = {}
  filenameList.forEach(function (filename) {
    var index = filename.lastIndexOf('.')
    var ext = filename.slice(index + 1)
    if (ext !== 'js') return
    var name = filename.slice(0, index)
    entry[name] = path.resolve(entryDir, filename)
  })
  return entry
}

Object.assign(config, {
  entry: genEntry()
})

Object.assign(config.output, {
  path: path.join(process.cwd(), 'dist/js'),
  filename: '[name].js'
})

Object.assign(config.resolve, {
  root: [
    path.join(process.cwd(), 'src/js')
  ]
})

Object.assign(config.resolve.alias, {
  'strap': path.join(process.cwd(), 'submodule/regular-strap/src')
})

Array.prototype.push.apply(config.plugins, [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    minChunks: 2
  })
])

var isProduction = env.isProduction()
if (isProduction) {
  Array.prototype.push.apply(config.plugins, config.optimizePlugins)
}

module.exports = config
