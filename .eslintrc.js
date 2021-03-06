// const { alias } = require("./razzle-plugins/di")
const alias = {
  '@main': 'E:\\work\\github\\with-razzle\\src\\apps\\@main',
  'aw-am': 'E:\\work\\github\\with-razzle\\src\\apps\\aw-am',
  'aw': 'E:\\work\\github\\with-razzle\\src\\apps\\aw',
  '@': 'E:\\work\\github\\with-razzle\\src\\apps\\@main'
}

// react
var react = {
  "extends": ["react-app"]
}

// browser compatiblity.
var compat = {
  "env": {
    "browser": true
  },
  "plugins": [
    "compat"
  ],
  "rules": {
    "compat/compat": 2
  }
}

// import resolver.
var resolver = {
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [
          ".js",
          ".jsx",
          ".css"
        ]
      },
      "babel-module": {
        "alias": alias
      }
    }
  },
  "plugins": [
    "import"
  ],
  "extends": [
    "plugin:import/errors",
    "plugin:import/warnings"
  ],
}

// general configuration.
var general = {
  "rules": {
    "semi": [2, "never"],
  },
}

var configuration = {
  extends: [].concat(react.extends, resolver.extends),
  plugins: [].concat(compat.plugins, resolver.plugins),
  env: Object.assign({}, compat.env),
  rules: Object.assign({}, general.rules, compat.rules),
  settings: Object.assign({}, resolver.settings),
}

module.exports = configuration

