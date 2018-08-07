const PurifyCSSPlugin = require("purifycss-webpack")
const ExtractPlugin = require("mini-css-extract-plugin")   
module.exports = (config, { target, dev }, webpack, userOptions = {}) => {
  if (!dev && target === 'web') {
    const purifyCSSPlugin = new PurifyCSSPlugin(userOptions)
    for (let i = 0; i < config.plugins.length; i++) {
      let plugin = config.plugins[i]
      if(plugin instanceof ExtractPlugin) {
        config.plugins.splice(i+1, 0, purifyCSSPlugin)
      }
    }
  }
  return config
}
