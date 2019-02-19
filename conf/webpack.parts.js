const webpack = require('webpack');
const path = require('path');
const cssnano = require('cssnano');
const scripts = require('./scripts');
const PKG = require('../package.json');
const templates = require('./templates');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

exports.entry = ({...entry}) => ({
	entry: entry
});

exports.output = ({filename, library}) => ({
	output: {
		path: scripts.root(PKG.directories.src),
		filename,
		library
	},
	plugins: [
		new FriendlyErrorsWebpackPlugin()
	]
});

exports.resolver = () => ({
	resolve: {
		extensions: ['.js', '.scss'],
		alias: {
			root: scripts.root('/'),
			'@': scripts.root(PKG.directories.src),
			styles: scripts.root(PKG.directories.src + '/styles'),
			utils: scripts.root(PKG.directories.src + '/utils'),
		}
	}
});

exports.loadJavaScript = ({use = []} = {}) => ({
	module: {
		rules: [
			{
				test: /\.js$/,
				include: scripts.root(PKG.directories.src),
				exclude: /node_modules/,
				use: [].concat(use)
			}
		]
	}
});

exports.pugLoader = () => ({
	module: {
		rules: [{
			test: /\.pug/,
			loaders: ['html-loader', 'pug-html-loader']
		}]
	}
});

exports.loadCSS = () => ({
	module: {
		rules: [
			{
				test: /\.(sa|sc|c)ss$/,
				use: ['style-loader', 'css-loader', 'sass-loader']
			}
		]
	}
});

exports.loadImages = () => ({
	module: {
		rules: [
			{
				test: /\.(png|gif|jpe?g)$/i,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'images'
					}
				}
			}
		]
	}
});

exports.loadFonts = () => ({
	module: {
		rules: [
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'fonts'
					}
				}

			}
		]
	}
});

exports.loadSvg = () => ({
	module: {
		rules: [
			{
				test: /\.svg$/,
				loader: 'svg-inline-loader'
			}
		]
	}
});

exports.extractCSS = ({filename, use = []}) => {

	const plugin = new MiniCssExtractPlugin({
		filename
	});

	return {
		module: {
			rules: [
				{
					test: /\.(sa|sc|c)ss$/,
					use: [
						MiniCssExtractPlugin.loader
					].concat(use)
				}
			]
		},
		plugins: [plugin]
	};
};

exports.clean = ({files, pathx = 'dist'}) => ({
	plugins: [
		new CleanWebpackPlugin(
			files,
			{
				root: path.resolve(__dirname, pathx),
				verbose: false,
				dry: false,
				watch: false
			}
		)
	]
});

exports.autoprefix = () => ({
	loader: 'postcss-loader',
	options: {
		plugins: () => [autoprefixer()]
	}
});

exports.generateSourceMaps = ({devtool}) => ({
	devtool
});

exports.watch = () => ({
	watch: true
});

exports.minifyJavaScript = () => ({
	optimization: {
		noEmitOnErrors: true,
		minimizer: [new UglifyWebpackPlugin({
			sourceMap: false
		})],
		splitChunks: {
			chunks: 'all',
		}
	}
});

exports.minifyCSS = () => ({
	plugins: [
		new OptimizeCSSAssetsPlugin({
			cssProcessor: cssnano,
			cssProcessorOptions: {
				options: {
					discardComments: {
						removeAll: true
					},
					safe: true
				}
			},
			canPrint: false
		})
	]
});

exports.devServer = ({
	port = 8080,
	stats = 'minimal',
	lazy = false,
	hot = false,
	open = false,
	} = {}) =>({

	devServer: {
		port,
		stats,
		hot,
		open,
		overlay: true,
		watchOptions: {
			aggregateTimeout: 300,
			poll: 1000
		},
	},
	plugins: [
		new webpack.WatchIgnorePlugin([
			scripts.root('node_modules')
		]),
		new webpack.HotModuleReplacementPlugin()
	]
});

exports.page = ({
	                chunks = [],
	                title = 'Hello title',
	                slug = 'index',
	                template = 'index',
	                bodyClass = '',
	                options = 'default'
                } = {}) => {
	return {
		plugins: [
			new HtmlWebpackPlugin({
				chunks,
				title,
				filename: `${slug}.html`,
				template: `src/pages/${slug}/index.pug`,
				bodyClass,
				...templates[options]
			}),
			new ScriptExtHtmlWebpackPlugin({
				defaultAttribute: 'defer'
			})
		]
	}
};
