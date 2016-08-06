/**
* @Author: Yingya Zhang <zyy>
* @Date:   2016-06-26 17:57:00
* @Email:  zyy7259@gmail.com
* @Last modified by:   zyy
* @Last modified time: 2016-08-06T17:27:45+08:00
*/

var pjson = require('../package.json')
var env = require('./env')
var path = require('path')
// var HtmlWebpackPlugin = require('html-webpack-plugin')

var config = require('./webpack.base.config.js')

Object.assign(config, {
  entry: './src/index',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'lib.js',
    library: 'Lib',
    libraryTarget: 'umd'
  },
  postcss: function () {
    return [
      require('precss'),
      require('postcss-custom-properties'),
      require('postcss-calc'),
      require('autoprefixer'),
      require('cssnano')
    ]
  },
  externals: [
    {
      'regularjs': {
        root: 'Regular',
        amd: 'Regular',
        commonjs: 'regularjs',
        commonjs2: 'regularjs'
      },
      'lodash': {
        root: 'Lodash',
        amd: 'Lodash',
        commonjs: 'lodash',
        commonjs2: 'lodash'
      }
    }
  ]
})

Object.assign(config.resolve, {
  root: [
    path.resolve(__dirname, '../src')
  ]
})

var isProduction = env.isProduction()
if (isProduction) {
  config = [config, Object.assign({}, config)]
  config[0].output = Object.assign({}, config[0].output)
  config[0].output.filename = config[0].output.filename.replace('.js', '.min.js')
  config[1].output.filename = config[1].output.filename.replace('.js', '.' + pjson.version + '.min.js')
}

module.exports = config
