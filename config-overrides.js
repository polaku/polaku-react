const webpack = require('webpack');

module.exports = {
  webpack: function override(config, _) {
    for (let i = 0; i < config.plugins.length; i++) {
      const current = config.plugins[i]
      if (current instanceof webpack.DefinePlugin) {
        config.plugins[i] = new webpack.DefinePlugin({
          ...current
        })
      }
    }
    return {
      ...config,
      plugins:[
        ...config.plugins,
        // other: OtherPlugin
      ],
    }
  }
}