module.exports = {
    plugins: [
      {
        name: 'typescript',
        options: {
          useBabel: true,
          useEslint: true,
        },
      },
    ],
    modify: (config, { target, dev }, webpack) => {
      config.devtool = dev ? 'eval-source-map' : 'none'
      return config
    }
  }