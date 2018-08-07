const sourceMap = require('./razzle-plugins/source-map')
const postcssExtension = require('./razzle-plugins/postcss-extension')
const purifycss = require('./razzle-plugins/purify-css')
const reactLoadable = require('./razzle-plugins/react-loadable')

const path = require('path')
const glob = require('glob-all')
module.exports = {
    plugins: [
      {
        name: 'typescript',
        options: {
          useBabel: true,
          useEslint: true,
        },
      },
      {
        func: sourceMap,
        options: {
        },
      },
      {
        func: postcssExtension,
        options: {
          plugins:[
            require('tailwindcss')(path.join(__dirname, 'tailwind.js'))
          ]
        },
      },
      {
        func: purifycss,
        options: {
          paths: glob.sync([path.join(__dirname, "src/**/*.[tj]s?(x)")]),
          minimize: true
        },
      },
      {
        func: reactLoadable,
        options: {
          filename: path.join(__dirname, "build/react-loadable.json"),
        },
      },
    ],
    modify: (config, { target, dev }, webpack) => {
      if(target === 'web') {
        //console.dir(config ,{depth:10})
        //console.dir(ExtractTextPlugin.extract({use}), {depth:10})
      }
      return config
    }
  }