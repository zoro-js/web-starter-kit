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

var config = require('./webpack.base.config.js')

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

Object.assign(config, {
  entry: genEntry(),
  output: {
    path: path.join(__dirname, '../dist/js'),
    filename: '[name].js'
  }
})

Object.assign(config.resolve, {
  root: [
    path.resolve(__dirname, '../src/js')
  ]
})

Object.assign(config.resolve.alias, {
  'strap': path.resolve(__dirname, '../submodule/regular-strap/src')
})

config.plugins.push([
  new webpack.optimize.CommonsChunkPlugin('common.js')
])

var isProduction = env.isProduction()
if (isProduction) {
  Array.prototype.push.apply(config.plugins, config.optimizePlugins)
}

module.exports = config
