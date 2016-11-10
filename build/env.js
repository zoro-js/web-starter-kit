var env = {}

const NODE_ENV_PRODUCTION = 'production'
const NODE_ENV_DEVELOPMENT = 'development'

env.getNodeEnv = function () {
  return process.env.NODE_ENV || NODE_ENV_DEVELOPMENT
}

env.isProduction = function () {
  return env.getNodeEnv() === NODE_ENV_PRODUCTION
}

env.notProduction = function () {
  return env.getNodeEnv() !== NODE_ENV_PRODUCTION
}

env.isDevelopment = function () {
  return env.getNodeEnv() === NODE_ENV_DEVELOPMENT
}

env.notDevelopment = function () {
  return env.getNodeEnv() !== NODE_ENV_DEVELOPMENT
}

module.exports = env
