const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

const PATH = path.resolve(__dirname, '../');
const devMode = process.env.NODE_ENV !== 'production';

console.log( 'mode: ', devMode );
console.log( '__dirname: ', __dirname );
console.log( 'dist: ', path.join(__dirname, '../dist') );
console.log( 'PATH: ', PATH, '\n\n\n');

module.exports = {
	mode: 'development',
	context: PATH,
	entry: {
		purejs: './src/purejs.js',
		app: './src/app.js',
		mdpapp: './src/mdpapp.js'
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
					// devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
					MiniCssExtractPlugin.loader,
				  'css-loader',
				  'sass-loader'
				]
			},
		]
	},
	
	plugins: [
		// make sure to include the plugin for the magic
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			// publicPath: '/css/',
			filename: "[name].css",
		})
	  ],
	
	devtool: 'source-map',
	
	devServer: {
		contentBase: './viewers/',
		publicPath: '/dist/',
		open: true
		}
	
};
