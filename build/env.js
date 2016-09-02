var env = {}

env.isProduction = function () {
  return process.env.NODE_ENV === 'production'
}

env.notDevelopment = function () {
  const NODE_ENV = process.env.NODE_ENV
  return typeof NODE_ENV !== 'undefined' && NODE_ENV !== 'development'
}

module.exports = env
