const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');

const PATH = path.resolve(__dirname, '../');
const isDev = process.env.NODE_ENV !== 'production';

console.log( 'mode: ', isDev );
console.log( '__dirname: ', __dirname );
console.log( 'dist: ', path.join(__dirname, '../dist') );
console.log( 'PATH: ', PATH, '\n\n\n');

module.exports = {
	mode: 'development',
	context: PATH,
	entry: {
		index: ['./src/index.js', './src/app.js'],
	},
	output: {
		filename: '[name]-bundle.js',
		path: path.resolve( PATH, 'dist'),
	},

	module: {
		rules: [
			{ test: /\.js$/, 
				exclude: /node_modules/, 
				loader: "babel-loader" 
				// options: { presets: ['env'] }
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {
						js: 'babel-loader'
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					'vue-style-loader',
					'css-loader',
					// 'autoprefixer-loader'
				]
			},
			{
				test: /\.scss$/,
				use: [
				  'vue-style-loader',
				  'css-loader',
				  'sass-loader'
				]
			},
		]
	},
	
	plugins: [
		// make sure to include the plugin for the magic
		new VueLoaderPlugin(),
	  ],
	
	devtool: 'source-map',
	
	devServer: {
		contentBase: './viewers/',
		publicPath: '/dist/',
		open: true
		}
	
};
