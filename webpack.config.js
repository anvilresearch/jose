var path = require('path')

module.exports = {
  entry: [
    './lib/index.js'
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: 'jose.min.js',
    library: 'JOSE',
    libraryTarget: 'var'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  externals: {
    'text-encoding': 'TextEncoder',
    '@trust/webcrypto': 'crypto'
  },
  devtool: 'source-map'
}
