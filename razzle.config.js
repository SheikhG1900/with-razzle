const path = require('path')
const glob = require('glob-all')

const typescript = {
  name: 'typescript',
  options: {
    useBabel: true,
    useEslint: true,
  },
}

const sourceMap = {
  func: require('./razzle-plugins/source-map'),
  options: {
  },
}

const postcssExtension = {
  func: require('./razzle-plugins/postcss-extension'),
  options: {
    plugins: [
      require('tailwindcss')(path.join(__dirname, 'tailwind.js'))
    ]
  },
}

const purifycss = {
  func: require('./razzle-plugins/purify-css'),
  options: {
    paths: glob.sync([path.join(__dirname, "src/**/*.[tj]s?(x)")]),
    minimize: true
  },
}

const di = {
  func: require('./razzle-plugins/di'),
}

const reactLoadable = {
  func: require('./razzle-plugins/react-loadable'),
  options: {
    filename: "../react-loadable.json",
    writeToDisk: true
  },
}


module.exports = {
  plugins: [typescript, sourceMap, postcssExtension, purifycss, reactLoadable, di],
  modify: (config, { target, dev }, webpack) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src/main/')
    config.resolve.alias['@aw'] = path.resolve(__dirname, 'src/aw/')
    if (target === 'web') {
      //console.dir(config ,{depth:10})
      //console.dir(ExtractTextPlugin.extract({use}), {depth:10})
    }
    return config
  }
}