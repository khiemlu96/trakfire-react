module.exports = {
  entry: ['./client/js/app.jsx'],
  output: {
    path: './public',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.jsx$/, loader: 'jsx-loader' }
    ]
  },
  plugins: []
};