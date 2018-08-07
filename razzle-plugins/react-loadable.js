const { ReactLoadablePlugin } = require('react-loadable/webpack')
module.exports = (config, { target, dev }, webpack, userOptions = {}) => {
  if (target === 'web') {
    config.plugins = [ ...config.plugins, new ReactLoadablePlugin(userOptions)] 
  }
  return config
}