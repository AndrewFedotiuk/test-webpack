const merge = require('webpack-merge');
const CONFIG = require('./config');
const parts = require('./webpack.parts');

const commonConfig = merge([

	parts.entry(CONFIG.MAIN.ENTRIES),
	parts.resolver(),
	parts.loadJavaScript(),
	parts.pugLoader(),
	parts.loadImages(),
	parts.loadFonts(),
	parts.loadSvg(),
]);

const developmentConfig = merge([
	parts.output({
		filename: 'js/[name].js?[hash]',
		library: 'app',
	}),
	parts.loadCSS(),
	parts.generateSourceMaps('inline-source-map'),
	parts.watch(),
	parts.devServer({
		stats: 'errors-only',
		hot: false,
		open: false,
		lazy: true
	}),
]);

const productionConfig = merge([
	parts.clean({
		files: ['dist']
	}),
	parts.output({
		filename: 'js/[name].[hash:8].build.js'
	}),
	parts.loadJavaScript({
		use: ['babel-loader']
	}),
	parts.extractCSS({
		filename: 'css/[name].[hash:8].build.css',
		use: [{
			loader: 'css-loader'
		},
			parts.autoprefix(),
			'sass-loader']
	}),
	parts.minifyCSS(),
	parts.minifyJavaScript()
]);


module.exports = env => {

	const pages = CONFIG.MAIN.PAGES.map(item => parts.page(item));
	const config = env === 'production' ? productionConfig : developmentConfig;
	return merge([commonConfig, config, ...pages, {mode: env}]);
};
