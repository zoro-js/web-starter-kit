/*
* @Author: Zhang Yingya(hzzhangyingya)
* @Date:   2016-06-13 22:47:04
* @Last modified by:   zyy_hzzhangyingya
* @Last modified time: 2016-06-21 00:04:96
*/

const env = require('./env')
const path = require('path')
const postcss = require('postcss')
const sprites = require('postcss-sprites')

let config = {
  input: 'src/postcss/**/*.css',
  dir: 'dist/css',
  'local-plugins': true,
  use: [
    'precss',
    'postcss-calc',
    'postcss-sprites',
    'autoprefixer'
  ],
  autoprefixer: {
    browsers: ['Android >= 4', 'iOS >= 7', 'Chrome >= 10', 'Firefox >= 10', 'IE >= 8']
  },
  'postcss-sprites': {
    stylesheetPath: path.join(__dirname, '../dist/css'),
    spritePath: path.join(__dirname, '../dist/img'),
    filterBy: (() => {
      const png = /\.png$/i
      return function (image) {
        // Allow only png files
        if (!png.test(image.url)) {
          return Promise.reject()
        }
        return Promise.resolve()
      }
    })(),
    groupBy: (() => {
      const basedir = '/res/img/'
      let sep = path.sep
      if (sep === '\\') {
        sep = '\\\\'
      }
      sep = new RegExp(sep, 'ig')
      return function (image) {
        // one group for each dir
        const dirname = path.dirname(image.url)
        const group = dirname.replace(basedir, '').replace(sep, '-')
        return Promise.resolve(group)
      }
    })(),
    hooks: {
      onUpdateRule: (() => {
        const updateRule = sprites.updateRule
        const props = ['width', 'height']
        return function (rule, token, image) {
          // output dimensions
          // use build-in login for background-image & background-position
          updateRule(rule, token, image)
          for (const prop of props) {
            rule.insertAfter(rule.last, postcss.decl({
              prop,
              value: image.coords[prop] + 'px'
            }))
          }
        }
      })()
    }
  }
}

if (env.isProduction()) {
  config.use.push('cssnano')
  config.map = false
} else {
  config.map = 'inline'
}

module.exports = config
