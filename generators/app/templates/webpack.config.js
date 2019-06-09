const chalk = require('chalk');
const fs = require('fs');

const CompressionPlugin = require('compression-webpack-plugin');
const NgrockWebpackPlugin = require('ngrock-webpack-plugin');
const webpackBase = require('webpack');

const { application, webpack } = require('xes-webpack-core');

const app = application.getEnvApp();
const appWebpack = `./webpack.${app}.config.js`;

// TODO: move to xes-webpack-core
const getEnv = (envName, appName) => [
	// prettier-ignore
	'.env.default',
	'.env',
	`.env.${envName}`,
	`.env.${appName}`,
	`.env.${appName}.${envName}`,
].reduce((result, filePath) => {
	if (fs.existsSync(filePath)) {
		console.log(chalk.bold.yellow('Adding env config from: '), filePath);
		result = { ...result, ...require('dotenv').config({ path: filePath }).parsed};
	}
	return result;
}, {});

const factoryConfig = {
	config: (() => {
		const config = application.extractAppConfig();

		console.log(chalk.bold.yellow('Extending template env config...'));
		config.templateData.env = getEnv(process.env.ENV, app);

		return config;
	})(),
	useBabelrc: true,
};

const configureWebpack = (config) => {
	console.log(chalk.bold.yellow('Base WEBPACK setup'));

	config.output.filename = '[name].js';
	config.output.chunkFilename = '[name].js';

	// if you are using moment you can reduce amount of locales here
	// config.plugins.push(new webpackBase.ContextReplacementPlugin(/moment[\/\\]locale$/, /(en|pl)$/));

	// handle SPA routing redirecting any path to root index.html
	// config.output.publicPath = '/';
	config.devServer.historyApiFallback = true;

	// TODO: move to xes-webpack-core
	config.plugins.push(new webpackBase.ProgressPlugin());

	const env = Object.entries(getEnv(process.env.ENV, app)).reduce((result, [key, value]) => {
		result[`process.env.${key}`] = JSON.stringify(value);

		return result;
	}, {});

	config.plugins = [
		new webpackBase.DefinePlugin(env),
		...config.plugins,
	];

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

	if (process.env.ENV === 'development') {
		config.resolve.alias = {
			'react-dom': '@hot-loader/react-dom',
		};
	} else if (process.env.ENV === 'production') {
		config.plugins.push(new CompressionPlugin());
		// if you are using moment you can reduce amount of locales here
		config.plugins.push(new webpackBase.ContextReplacementPlugin(/moment[\/\\]locale$/, /(en|pl)$/));
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
