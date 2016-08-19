/**
* @Author: Yingya Zhang <zyy>
* @Date:   2016-06-26 17:57:00
* @Email:  zyy7259@gmail.com
* @Last modified by:   zyy
* @Last modified time: 2016-08-06T17:27:45+08:00
*/

const pjson = require('../package.json')
const env = require('./env')
const path = require('path')
// const HtmlWebpackPlugin = require('html-webpack-plugin')

let config = require('./webpack.config.base.js')

config.entry = './src/index'

Object.assign(config.output, {
  path: path.join(process.cwd(), '../dist'),
  filename: 'lib.js',
  library: 'Lib',
  libraryTarget: 'umd'
})

Object.assign(config, {
  postcss () {
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
      },
      'zoro-base': {
        root: 'ZoroBase',
        amd: 'ZoroBase',
        commonjs2: 'zoro-base',
        commonjs: 'zoro-base'
      }
    }
  ]
})

Object.assign(config.resolve, {
  root: [
    path.join(process.cwd(), '../src')
  ]
})

const isProduction = env.isProduction()
if (isProduction) {
  config = [config, Object.assign({}, config), Object.assign({}, config)]
  config[0].output = Object.assign({}, config[0].output)
  config[0].plugins = config[0].plugins.slice(0)
  config[1].output = Object.assign({}, config[1].output)
  config[1].output.filename = config[1].output.filename.replace('.js', '.min.js')
  config[2].output = Object.assign({}, config[2].output)
  config[2].output.filename = config[2].output.filename.replace('.js', '.' + pjson.version + '.min.js')
  Array.prototype.push.apply(config[1].plugins, config.optimizePlugins)
}

module.exports = config
