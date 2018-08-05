const getPostcssLoader = (rule) => {
  const loaders = rule.use || []
  for (let index = 0; index < loaders.length; index++) {
    const loader = loaders[index]
    if(typeof loader === 'string' && loader.includes('postcss-loader')) {
      return { loader: { loader }, index}
    }
    if((loader.loader && typeof loader.loader === 'string' && loader.loader.includes('postcss-loader'))) {
      return { loader, index}
    }
  }
  return null
}

const addplugins = (options, userOptions, processedOptions) => {
  if(!userOptions.plugins || processedOptions.find(opts => opts === options)) {
    return options
  }

  options = options || {}
  options.ident = 'postcss'

  if(!options.plugins) {
    options.plugins = () => userOptions.plugins
  } else if (typeof options.plugins === 'function') {
    const plugins = options.plugins()
    options.plugins = () => [...userOptions.plugins, ...plugins]
  } else if (Array.isArray(options.plugins)) {
    options.plugins = () => [...userOptions.plugins, ...options.plugins]
  }
  return options
}

module.exports = (config, { target, dev }, webpack, userOptions = {}) => {
  if(target === 'web') {
    const rules = config.module.rules
    
    // it is to handle same option reference against multiple loaders. 
    const processedOptions = []
    
    for (let index = 0; index < rules.length; index++) {
      const rule = rules[index]
      const wrapper = getPostcssLoader(rule)
      if(wrapper) {
        wrapper.loader.options = addplugins(wrapper.loader.options, userOptions, processedOptions)
        
        // add option to processed list
        processedOptions.push(wrapper.loader.options)

        // update loader to the webpack configuration
        rule.use[wrapper.index] = wrapper.loader
      }  
    }
  }
  return config
}