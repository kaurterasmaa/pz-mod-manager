const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', // Inject CSS into the DOM
          'css-loader'    // Translates CSS into CommonJS
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    })
  ],
  resolve: {
    fallback: {
      fs: false, // Disable fs module (not needed in browser)
      path: require.resolve('path-browserify'), // Provide fallback for path
    },
  },
  devServer: {
    port: 3000,
    hot: true, // Enable hot-reloading
    static: {
      directory: path.join(__dirname, 'dist'), // Serve files from the dist folder
    },
    historyApiFallback: true, // For single-page applications
  }
};
