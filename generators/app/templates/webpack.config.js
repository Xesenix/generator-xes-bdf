const chalk = require('chalk');
const fs = require('fs');

const CompressionPlugin = require('compression-webpack-plugin');
const NgrockWebpackPlugin = require('ngrock-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpackBase = require('webpack');

const { application, webpack } = require('xes-webpack-core');

const app = application.getEnvApp();
const appWebpack = `./webpack.${app}.config.js`;

const factoryConfig = {
	config: (() => {
		const config = application.extractAppConfig();

		if (process.env.DI === 'true') {
			console.log(chalk.bold.yellow('Generating dependency injection report...'));
			config.main = ['di.ts'];
		}

		return config;
	})(),
	useBabelrc: true,
};

const configureWebpack = (config) => {
	console.log(chalk.bold.yellow('Base WEBPACK setup'));

	config.output.filename = '[name].js';
	config.output.chunkFilename = '[name].js';

	// handle SPA routing redirecting any path to root index.html
	// config.output.publicPath = '/';
	config.devServer.historyApiFallback = true;

	// TODO: move to xes-webpack-core
	if (process.env.ENV !== 'test') {
		// this option doesn't work well with tests
		// for some reason it mismatches files so karma doesn't see spec files
		config.optimization.splitChunks = {
			chunks: 'all',
		};
	}

	// TODO: move to xes-webpack-core
	if (process.env.CHECK_TYPESCRIPT) {
		config.module.rules[3] = {
			test: /\.tsx?$/,
			use: 'ts-loader',
			exclude: /node_modules/,
		};
	}

	if (process.env.ENV === 'production') {
		config.plugins.push(new CompressionPlugin());
		// if you are using moment you can reduce amount of locales here
		config.plugins.push(new webpackBase.ContextReplacementPlugin(/moment[\/\\]locale$/, /(en|pl)$/));

		config.optimization.minimizer = [
			...config.optimization.minimizer || [],
			new TerserPlugin(),
		];
	}

	if (process.env.EXPOSE === 'ngrok') {
		config.plugins.push(new NgrockWebpackPlugin());
	}

	return config;
};

const baseConfiguration = configureWebpack(webpack.webpackConfigFactory(factoryConfig));

// load additional per application webpack configuration
if (fs.existsSync(appWebpack)) {
	module.exports = () => require(appWebpack)(baseConfiguration);
} else {
	module.exports = () => baseConfiguration;
}
