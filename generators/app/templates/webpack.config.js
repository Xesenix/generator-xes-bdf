const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const webpackBase = require('webpack');
const { application, webpack } = require('xes-webpack-core');

const app = application.getEnvApp();
const appWebpack = `./webpack.${app}.config.js`;

const factoryConfig = {
	useBabelrc: true,
};

const configureWebpack = (config) => {
	console.log(chalk.bold.yellow('Base WEBPACK setup'));

	config.output.filename = '[name].js';
	config.output.chunkFilename = '[name].js';

	// if you are using moment you can reduce amount of locales here
	// config.plugins.push(new webpackBase.ContextReplacementPlugin(/moment[\/\\]locale$/, /(en|pl)$/));

	return config;
};

const baseConfiguration = configureWebpack(webpack.webpackConfigFactory(factoryConfig));

// load additional per application webpack configuration
if (fs.existsSync(appWebpack)) {
	module.exports = (env) => require(appWebpack)(baseConfiguration);
} else {
	module.exports = (env) => baseConfiguration;
}
