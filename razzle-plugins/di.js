const path = require('path')
const { NormalModuleReplacementPlugin } = require('webpack')
module.exports = (config, { target, dev }, webpack, userOptions = {}) => {
    config.plugins = [...config.plugins, new NormalModuleReplacementPlugin(/.*/, (resource) => {
        if (resource.request === '@/Home') {
            console.log({ context: resource.context, request: resource.request })
            resource.request = '@aw/Home'
        }
    })]
    return config
}