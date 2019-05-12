const path = require('path')
const { lstatSync, readdirSync, statSync } = require('fs')

const { NormalModuleReplacementPlugin } = require('webpack')

const throwif = (condition, error = new Error('unknown error')) => {
    if(condition) {
        throw error
    }
    return false
} 
const getBasePath = () => path.resolve(__dirname, '../')
const getDiConfig = () => require('../src/@di-config')
const getAppPath = (appName = getDiConfig().runApp) =>  path.resolve(getBasePath(), `src/${appName}`)
const getAppManifest = (appPath = getAppPath()) => require(path.resolve(appPath, '@manifest'))
const getDependencies = (manifest = getAppManifest(), dependencies = [getDiConfig().runApp]) => {
    const app = dependencies[dependencies.length - 1] 
    const dependencyNotDefined = !manifest.depends && app !== 'main'
    const dependency = throwif(dependencyNotDefined, new Error(`The app '${app}' should define 'depends' field in @manifest.js. hint {depends:'main'}`)) || manifest.depends
    if(!dependency) return dependencies

    throwif(dependencies.find((d) => d === dependency), new Error(`dependency cycle detected. {depends:'${dependency}'}' should not be in @manifest.js of the app, '${app}'.
    Defined dependencies in order: ${dependencies}`))
    
    dependencies.push(dependency)
    return getDependencies(getAppManifest(getAppPath(dependency)), dependencies)
    
} 
const getFiles = (dir, base = '') => readdirSync(dir, {withFileTypes: true}).reduce((files, file) => {
    const filePath = path.join(dir, file.name)
    const relativePath = path.join(base, file.name)
    if(file.isDirectory()) {
        return files.concat(getFiles(filePath, relativePath))
    } else if(file.isFile()) {
        file.__fullPath = filePath
        file.__relateivePath = relativePath
        return files.concat(file)
    }
}, [])
const getAliasConfig = () => {
    const aliasConfig = getDependencies().reduce((config, dependency) => {
        config[`@${dependency}`] = getAppPath(dependency)
        return config
    }, {})
    aliasConfig['@'] = getAppPath("main")
    return aliasConfig
}     

module.exports.alias = getAliasConfig()
module.exports.func = (config, { target, dev }, webpack, userOptions = {}) => {
    console.log({dependencies:getDependencies(), alias:getAliasConfig()})
    config.plugins = [...config.plugins, new NormalModuleReplacementPlugin(/.*/, (resource) => {
        if (resource.request === '@/Home') {
            //console.log({resource, context: resource.context, request: resource.request })
            resource.request = '@aw/Home'
        }
    })]
    config.resolve.alias = {...config.resolve.alias, ...getAliasConfig()}
    return config
}
