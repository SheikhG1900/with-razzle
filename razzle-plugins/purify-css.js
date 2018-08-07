const PurifyCSSPlugin = require("purifycss-webpack")
module.exports = (config, { target, dev }, webpack, userOptions = {}) => {
  if (!dev && target === 'web') {
    config.plugins = [ ...config.plugins, new PurifyCSSPlugin(userOptions)] 
  }
  return config
}
