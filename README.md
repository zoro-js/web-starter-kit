<!--
@Author: Yingya Zhang <zyy>
@Date:   2016-06-25 21:25:00
@Email:  zyy7259@gmail.com
@Last modified by:   zyy
@Last modified time: 2016-08-07T00:24:51+08:00
-->

# es5 -> es6

- module.exports/require -> import/export
- self/that -> () => {}
- var -> let/const
- object-shorthand
  - key: key -> key
  - a: function() {} -> a() {}

# install the followings locally which can not be installed globally

```javascript
npm install babel-loader babel-core babel-preset-es2015 babel-preset-stage-3 --save-dev
// http://stackoverflow.com/questions/33512715/babel-6-0-20-modules-feature-not-work-in-ie8
npm install babel-plugin-transform-es3-member-expression-literals babel-plugin-transform-es3-property-literals --save-dev
// https://www.npmjs.com/package/babel-plugin-add-module-exports
npm install babel-plugin-add-module-exports --save-dev
npm install html-loader json-loader raw-loader yaml-loader --save-dev
npm install style-loader css-loader postcss-loader precss postcss-calc postcss-custom-properties autoprefixer --save-dev
```

# install the followings devDependencies globally or locally

```
npm install rimraf -g
npm install eslint eslint-config-standard eslint-plugin-promise -g eslint-plugin-standard babel-eslint eslint-plugin-babel
npm install postcss postcss-cli -g
npm install webpack webpack-dev-server -g
npm install watch -g

npm install regular-state regularjs stateman -g
npm install fs-extra -g
npm install lodash -g
npm install once -g
npm install url -g
npm install xhr -g
```

# problems

https://github.com/eslint/eslint/issues/6274#issuecomment-228420692

# koa

npm i -g koa@next koa-router@next koa-mount koa-send koa-static
