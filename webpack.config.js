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
  externals: {
    'text-encoding': 'TextEncoder',
    webcrypto: 'crypto'
  },
  devtool: 'source-map'
}
