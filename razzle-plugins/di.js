const path = require('path')
const { lstatSync, readdirSync, statSync } = require('fs')
const { NormalModuleReplacementPlugin } = require('webpack')

const throwif = (condition, error = new Error('unknown error')) => {
    if (condition) {
        throw error
    }
    return false
}
const MAIN_APP = '@main'
const BASE_PATH = path.resolve(__dirname, '../')
const DI_CONFIG = require('../src/@di-config')

const getAppPath = (appName) => path.resolve(BASE_PATH, `src/${appName}`)
const MAIN_APP_PATH = getAppPath(MAIN_APP)

const getAppManifest = (appPath) => require(path.resolve(appPath, '@manifest'))
const RUN_APP_MANIFEST = getAppManifest(getAppPath(DI_CONFIG.runApp))

const getFiles = (dir, base = '') => readdirSync(dir, { withFileTypes: true }).reduce((files, file) => {
    const filePath = path.join(dir, file.name)
    const relativePath = path.join(base, file.name)
    if (file.isDirectory()) {
        return files.concat(getFiles(filePath, relativePath))
    } else if (file.isFile()) {
        file.__fullPath = filePath
        file.__relateivePath = relativePath
        return files.concat(file)
    }
}, [])

const getDependencies = (manifest = RUN_APP_MANIFEST, dependencies = [DI_CONFIG.runApp]) => {
    const app = dependencies[dependencies.length - 1]
    const dependencyNotDefined = !manifest.depends && app !== MAIN_APP
    const dependency = throwif(dependencyNotDefined, new Error(`The app '${app}' should define 'depends' field in @manifest.js. hint {depends:'main'}`)) || manifest.depends
    if (!dependency) return dependencies

    throwif(dependencies.find((d) => d === dependency), new Error(`dependency cycle detected. {depends:'${dependency}'}' should not be in @manifest.js of the app, '${app}'.
    Defined dependencies in order: ${dependencies}`))

    dependencies.push(dependency)
    return getDependencies(getAppManifest(getAppPath(dependency)), dependencies)

}
const dependencies = getDependencies()

const getApps = () => dependencies.reduce((apps, dependency, index, source) => {
    const path = getAppPath(dependency)
    apps[dependency] = {
        level: dependencies.length - index - 1,
        path,
        alias: dependency,
        app: dependency,
        files: getFiles(path).reduce((map, file) => {
            map[file.__relateivePath] = file
            return map
        }, {})
    }

    if (dependency === MAIN_APP) {
        apps['@'] = apps[dependency]
    }

    return apps
}, {})
const apps = getApps()

const getAliasConfig = () => {
    const aliasConfig = dependencies.reduce((config, dependency) => {
        config[dependency] = getAppPath(dependency)
        return config
    }, {})
    aliasConfig['@'] = MAIN_APP_PATH
    return aliasConfig
}
const alias = getAliasConfig()

const getPathApp = (path) => {
    const appName = Object.keys(apps).find((key) => path.startsWith(apps[key].path))
    if (appName) {
        return apps[appName]
    }
    return;
}

const resolveModule = (moduleId, basePath = BASE_PATH) => {
    const module = {}
    if (moduleId.startsWith('.')) {
        // relative module path.
        module.fullPath = path.resolve(basePath, moduleId)
        module.app = getPathApp(module.fullPath)
        if (!module.app) return null

        module.appRelativePath = path.relative(module.app.path, module.fullPath)
    } else {
        const [appName, otherPart] = moduleId.split('/', 2)
        if (apps[appName]) {

            let relativePath = ''
            if (otherPart) {
                relativePath = moduleId.substring(moduleId.indexOf('/') + 1)
            }

            const app = apps[appName]
            module.fullPath = path.resolve(app.path, relativePath)
            module.app = app
            module.appRelativePath = relativePath
        } else {
            return null
        }
    }
    return module
}

const dependencyInjector = (resource) => {
    if (resource.request === '@/Home') {
        const module = resolveModule(resource.request, resource.context)
        console.log({module, MAIN_APP, BASE_PATH, DI_CONFIG, MAIN_APP_PATH, RUN_APP_MANIFEST, dependencies, apps, alias, resource, context: resource.context, request: resource.request })
        // resource.request = '@aw/Home'
    }
}


const func = (config, { target, dev }, webpack, userOptions = {}) => {
    config.plugins = [...config.plugins, new NormalModuleReplacementPlugin(/.*/, dependencyInjector)]
    config.resolve.alias = { ...config.resolve.alias, ...getAliasConfig() }
    return config
}
module.exports = { alias, apps, func }
