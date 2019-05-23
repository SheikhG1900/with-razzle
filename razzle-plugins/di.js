const { resolve, relative, join, sep } = require('path')
const { readdirSync } = require('fs')
const { NormalModuleReplacementPlugin } = require('webpack')
const debug = require('debug')


debug.enable('di:info')
const info = debug('di:info')

debug.enable('di:instruction')
const instruction = debug('di:instruction')


const throwif = (condition, error = new Error('unknown error')) => {
    if (condition) {
        throw error
    }
    return false
}
const MAIN_APP = '@main'
const BASE_PATH = resolve(__dirname, '../')
const DI_CONFIG = require('../src/apps/@di-config')

const getAppPath = (appName) => resolve(BASE_PATH, `src/apps/${appName}`)
const MAIN_APP_PATH = getAppPath(MAIN_APP)

const getAppManifest = (appPath) => require(resolve(appPath, '@manifest'))
const RUN_APP_MANIFEST = getAppManifest(getAppPath(DI_CONFIG.runApp))

const getFiles = (dir, base = '') => readdirSync(dir, { withFileTypes: true }).reduce((files, file) => {
    const filePath = join(dir, file.name)
    const relativePath = join(base, file.name)
    if (file.isDirectory()) {
        return files.concat(getFiles(filePath, relativePath))
    } else if (file.isFile()) {
        file.__fullPath = filePath
        file.__relateivePath = relativePath
        return files.concat(file)
    }
    return files
}, [])

const getDependencies = (manifest = RUN_APP_MANIFEST, dependencies = [DI_CONFIG.runApp]) => {
    const app = dependencies[dependencies.length - 1]
    const dependencyNotDefined = !manifest.depends && app !== MAIN_APP
    const dependency = throwif(dependencyNotDefined, new Error(`The app '${app}' should define 'depends' field in @manifest.js. hint {depends:'@main'}`)) || manifest.depends
    if (!dependency) return dependencies

    throwif(dependencies.find((d) => d === dependency), new Error(`dependency cycle detected. {depends:'${dependency}'}' should not be in @manifest.js of the app, '${app}'.
    Defined dependencies in order: ${dependencies}`))

    dependencies.push(dependency)
    return getDependencies(getAppManifest(getAppPath(dependency)), dependencies)

}
const dependencies = getDependencies().reverse()  //top to bottom
const getApps = () => dependencies.reduce((apps, dependency, index, source) => {
    const path = getAppPath(dependency)
    apps[dependency] = {
        level: index,
        path,
        alias: dependency,
        name: dependency,
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

// eslint-disable-next-line compat/compat
const getPathApp = (path) => Object.values(apps).find((app) => path === app.path || path.startsWith(app.path + sep))

const resolveModule = (moduleId, basePath = BASE_PATH) => {
    const module = {}
    if (moduleId.startsWith('.')) {
        // relative module path.
        module.fullPath = resolve(basePath, moduleId)
        module.app = getPathApp(module.fullPath)
        if (!module.app) return null

        module.appRelativePath = relative(module.app.path, module.fullPath)
    } else {
        const [appName, otherPart] = moduleId.split('/', 2)
        if (apps[appName]) {

            let relativePath = ''
            if (otherPart) {
                relativePath = moduleId.substring(moduleId.indexOf('/') + 1)
            }

            const app = apps[appName]
            module.fullPath = resolve(app.path, relativePath)
            module.app = app
            module.appRelativePath = relativePath
        } else {
            return null
        }
    }
    return module
}

const getCustomizing = (module, contextApp) => {
    for (let i = dependencies.length - 1; i > contextApp.level; i--) {
        const dependency = dependencies[i]
        const app = apps[dependency]
        let file = null
        for (let ext of ['', '.js', '.jsx', 'ts', 'tsx']) {
            const relativePath = module.appRelativePath + ext
            file = app.files[relativePath]
            if (file) {
                return {file, app}
            }
        }
    }
}

const dependencyInjector = (resource) => {
    let module, contextApp, customizing
    if ((module = resolveModule(resource.request, resource.context))
        && (contextApp = getPathApp(resource.context))
        && (customizing = getCustomizing(module, contextApp))) {
        const { file, app } = customizing
        resource.request = file.__fullPath
        info(`[${contextApp.name}] [${module.app.name}->${app.name}] ${file.__relateivePath}`)
    }
}

const func = (config, { target, dev }, webpack, userOptions = {}) => {
    config.plugins = [...config.plugins, new NormalModuleReplacementPlugin(/.*/, dependencyInjector)]
    config.resolve.alias = { ...config.resolve.alias, ...getAliasConfig() }
    return config
}


instruction('update your .eslintrc.js with following configuration')
console.log({alias})

module.exports = { alias, apps, func }
