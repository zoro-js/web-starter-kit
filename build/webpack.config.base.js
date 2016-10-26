const cwd = process.cwd()
const env = require('./env')
const path = require('path')
const webpack = require('webpack')
const postcssConfig = require('./postcss')
const includeJSDir = path.join(cwd, 'src')
const nodeModulesDir = path.join(cwd, 'node_modules')

const config = {
  output: {},
  vue: {
    postcss: [
      require('postcss-import'),
      require('precss'),
      require('postcss-calc'),
      require('postcss-sprites')(postcssConfig['postcss-sprites']),
      require('autoprefixer')(postcssConfig.autoprefixer)
    ]
  },
  eslint: {
    configFile: path.join(cwd, '.eslintrc.yaml'),
    // Loader will always return warnings
    emitWarning: true
    // do not enable cache, it will not work properly
  },
  // when used with vue, the babel config should be placed here
  // http://vue-loader.vuejs.org/en/features/es2015.html
  babel: {
    presets: [
      ['stage-2'],
      ['es2015', {'loose': true, 'modules': 'commonjs'}]
    ],
    cacheDirectory: true,
    plugins: [
      // the 'transform-runtime' plugin tells babel
      // - Removes the inline babel helpers and uses the module babel-runtime/helpers instead.
      // - Automatically requires babel-runtime/regenerator when you use generators/async functions.
      // Automatically requires babel-runtime/core-js and maps ES6 static methods (Object.assign) and built-ins (Promise).
      // set polyfill to false to avoid runtime to polyfill, otherwise it will insert `import` to the generated code, which will not be recoginized by browser unless you webpack it.
      ['transform-runtime', {polyfill: false}],
      'add-module-exports',
      'transform-es3-property-literals',
      'transform-es3-member-expression-literals'
    ]
  },
  module: {
    preLoaders: [
      {test: /\.(?:js|vue)$/, loader: 'eslint', include: includeJSDir},
      {test: /\.(?:js)$/, loader: 'source-map', include: nodeModulesDir}
    ],
    loaders: [
      {test: /\.html$/, loader: 'raw'},
      {test: /\.json$/, loader: 'json'},
      {test: /\.yaml$/, loader: 'json!yaml'},
      {test: /\.css$/, loader: 'style!css!postcss'},
      {test: /\.vue$/, loader: 'vue'},
      {test: /\.js$/, include: includeJSDir, loader: 'babel'},
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url',
        query: {
          // limit for base64 inlining in bytes
          limit: 10000,
          // custom naming format if file is larger than
          // the threshold
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'data': path.join(cwd, 'data'),
      // the main file of vue 2.0 is ok, so no need to redefine
      // 'vuejs': path.join(cwd, 'node_modules/vue/dist/vue.min.js'),
      'axios': path.join(cwd, 'node_modules/axios/dist/axios.min'),
      'regularjs': path.join(cwd, 'node_modules/regularjs/dist/regular.min'),
      'restate': path.join(cwd, 'node_modules/regular-state/restate-full'),
      'stateman': path.join(cwd, 'node_modules/stateman/stateman.min')
    },
    extensions: ['', '.js', '.vue', '.json', '.yaml']
  },
  plugins: [
    new webpack.ProvidePlugin({
      Vue: 'vue',
      VueRouter: 'vue-router',
      Vuex: 'vuex',
      syncVuexRouter: 'vuex-router-sync',
      Regular: 'regularjs',
      restate: 'restate',
      RegularStrap: 'regular-strap',
      VueStrap: 'zoro-vue-strap',
      _: 'lodash'
    })
  ],
  node: {
    fs: 'empty'
  }
}

const isProduction = env.isProduction()
if (!isProduction) {
  Array.prototype.push.apply(config.plugins, [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    })
  ])
  // sourceMap 相关
  config.output.pathinfo = true
  if (!process.env.NO_SOURCE_MAP) {
    // config.devtool = '#eval-source-map'
    config.devtool = 'inline-module-source-map'
  }
} else {
  config.devtool = '#source-map'
  config.optimizePlugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15}),
    // in chars (a char is a byte)
    new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000})
  ]
}

module.exports = config
