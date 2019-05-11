const ReactLoadablePlugin = require('@loadable/webpack-plugin')
module.exports = (config, { target, dev }, webpack, userOptions = {}) => {
  if (target === 'web') {
    config.plugins = [ ...config.plugins, new ReactLoadablePlugin(userOptions)] 
  }
  return config
} 