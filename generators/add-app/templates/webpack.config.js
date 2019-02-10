const chalk = require('chalk');
const path = require('path');
const webpackBase = require('webpack');
const { webpack } = require('xes-webpack-core');

/**
 * Copy assets and fonts.
 */
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (config) => {
	console.log(chalk.bold.yellow('Setting WEBPACK for <%= appName %>...'));<% if (usePhaser) { %>
	config.module.rules.push(...webpack.loaders.shaderRulesFactory());

	console.log(chalk.bold.yellow('Adding Phaser 3 environment setup...'));
	config.plugins.push(new webpackBase.DefinePlugin({
		// required by Phaser 3
		'CANVAS_RENDERER': JSON.stringify(true),
		'WEBGL_RENDERER': JSON.stringify(true),
	}));<% } %>

	// config.devServer.disableHostCheck = true;

	// config.devtool = 'cheap-module-source-map';

	return config;
};
