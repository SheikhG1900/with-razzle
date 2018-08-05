module.exports = (config, { target, dev }, webpack) => {
  config.devtool = dev ? 'eval-source-map' : 'none'
  return config
}