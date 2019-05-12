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
const dependencies = getDependencies()

const getApps = () =>  dependencies.reduce((apps, dependency) => {
    const path =  getAppPath(dependency)
    apps[dependency] = { 
        path, 
        alias: `@${dependency}`,
        files: getFiles(path).reduce((map, file) => {
            map[file.__relateivePath] = file
            return map
        }, {})
    }
    return apps
}, {})
const apps = getApps()

const getAliasConfig = () => {
    const aliasConfig = dependencies.reduce((config, dependency) => {
        config[`@${dependency}`] =  getAppPath(dependency)
        return config
    }, {})
    aliasConfig['@'] = getAppPath("main")
    return aliasConfig
}     
const alias = getAliasConfig()

const func = (config, { target, dev }, webpack, userOptions = {}) => {
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
console.log(apps)
module.exports = { alias, apps,  func }
