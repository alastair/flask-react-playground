const path = require('path');

module.exports = {
  entry: './static/react-app.jsx',
  output: {
	filename: 'react-app.js',
	path: path.resolve(__dirname, 'static')
  },
  mode: "development",
  module: {
	rules: [
		{
		test: /\.jsx$/,
		exclude: /node_modules/,
		use: {
			loader: 'babel-loader'
		}
		}
	]
  }
};