const sourceMap = require('./razzle-plugins/source-map')
const postcssExtension = require('./razzle-plugins/postcss-extension')
const path = require('path')
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
    ],
    modify: (config, { target, dev }, webpack) => {
      if(target === 'web') {
        const ExtractPlugin = require("mini-css-extract-plugin")   
        const PurifyCSSPlugin = require('purifycss-webpack')
        const glob = require('glob-all')
        const purifyCSSPlugin =  new PurifyCSSPlugin({
          // Give paths to parse for rules. These should be absolute!
          paths: glob.sync([
            path.join(__dirname, 'src/**/*.[tj]s?(x)'),
          ]),
          minimize: true,
        })
        //const use = config.module.rules[5].use[0] = ExtractPlugin.loader
        //config.module.rules[5].use = ExtractPlugin.extract({use})
        //config.plugins.unshift(extractPlugin)
        for (let i = 0; i < config.plugins.length; i++) {
          let plugin = config.plugins[i]
          if(plugin instanceof ExtractPlugin) {
            config.plugins.splice(i+1,0,purifyCSSPlugin)
          }
        }
        console.log(glob.sync([
          path.join(__dirname, 'src/**/*.[tj]s?(x)'),
        ]))
        //console.dir(config ,{depth:10})
        //console.dir(ExtractTextPlugin.extract({use}), {depth:10})
      }
      return config
    }
  }