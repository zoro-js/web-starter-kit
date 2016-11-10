/*
* @Author: Zhang Yingya(hzzhangyingya)
* @Date:   2016-05-16 21:15:10
* @Last modified by:   zyy
* @Last modified time: 2016-08-06T17:26:19+08:00
*/

const cwd = process.cwd()
const debug = require('debug')('webpack:app')
const env = require('./env')
const webpack = require('webpack')
const path = require('path')
const globby = require('zoro-globby')
// const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = require('./webpack.config.base.js')()

function genEntry () {
  const entryDir = path.join(cwd, 'src/js/entry')
  const filepathList = globby.sync('**/*.js', entryDir)
  debug('filepathList', filepathList)
  const entry = {}
  filepathList.forEach(function (filepath) {
    const name = path.relative(entryDir, filepath).replace('.js', '')
    entry[name] = filepath
  })
  debug('entry', entry)
  return entry
}

Object.assign(config, {
  entry: genEntry()
})

Object.assign(config.output, {
  path: path.join(cwd, 'dist/js'),
  filename: '[name].js'
})

Object.assign(config.resolve, {
  root: [
    path.join(cwd, 'src/js'),
    path.join(cwd, 'third')
  ]
})

Array.prototype.push.apply(config.plugins, [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    minChunks: 2
  })
])

const isProduction = env.isProduction()
if (isProduction) {
  Array.prototype.push.apply(config.plugins, config.optimizePlugins)
}

module.exports = config
