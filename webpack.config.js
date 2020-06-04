const path = require('path');

module.exports = {
  entry: './static/react-app.tsx',
  output: {
	filename: 'react-app.js',
	path: path.resolve(__dirname, 'static')
  },
  mode: "development",
  module: {
	rules: [
		{
		test: /\.tsx$/,
		exclude: /node_modules/,
		use: {
			loader: 'babel-loader'
		}
		}
	]
  }
};