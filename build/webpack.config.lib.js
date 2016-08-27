const path = require('path')
const pjson = require(path.join(process.cwd(), './package.json'))
const env = require('./env')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
let config = require('./webpack.config.base.js')

module.exports = function ({output = {}, externals = []}) {
  config.entry = './src/index'

  Object.assign(config.output, {
    path: path.join(process.cwd(), 'dist'),
    filename: 'lib.js',
    library: 'Lib',
    libraryTarget: 'umd'
  }, output)

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
    externals
  })

  Object.assign(config.resolve, {
    root: [
      path.join(process.cwd(), 'src')
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
    Array.prototype.push.apply(config[1].plugins, config[1].optimizePlugins)
  }

  return config
}
