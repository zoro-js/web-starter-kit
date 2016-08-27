const env = require('./env')
const path = require('path')
const postcss = require('postcss')
const updateRule = require('postcss-sprites/lib/core').updateRule

let config = {
  input: 'src/postcss/**/*.css',
  dir: 'dist/css',
  'local-plugins': true,
  use: [
    'precss',
    'postcss-calc',
    'postcss-color-function',
    'postcss-sprites',
    'autoprefixer'
  ],
  autoprefixer: {
    browsers: ['Android >= 4', 'iOS >= 7', 'Chrome >= 10', 'Firefox >= 10', 'IE >= 8']
  },
  'postcss-sprites': {
    stylesheetPath: path.join(process.cwd(), 'dist/css'),
    spritePath: path.join(process.cwd(), 'dist/img'),
    retina: true,
    filterBy: (() => {
      const path = /sprite/i
      const png = /\.png$/i
      return function (image) {
        // Allow only png files whose path containing 'sprite'
        if (!png.test(image.url) || !path.test(image.url)) {
          return Promise.reject()
        }
        return Promise.resolve()
      }
    })(),
    groupBy: (() => {
      const basedir = '/res/img/sprite/'
      const sep = /\\\\|\//ig
      return function (image) {
        // one group for each dir
        const dirname = path.dirname(image.url)
        const group = dirname.replace(basedir, '').replace(sep, '.')
        return Promise.resolve(group)
      }
    })(),
    hooks: {
      onUpdateRule: (() => {
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
