'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');

const { getIgnoredPaths } = require('../../helpers/functions');

const promptColor = chalk.magenta;
const progressColor = chalk.blue;
const scriptColor = chalk.keyword('lime');

module.exports = class extends Generator {
	async prompting() {
		this.log(`\n${ progressColor(`REACT`) } General configuration...\n`);

		const prompts = [
			{
				type: 'list',
				name: 'useReact',
				message: promptColor(`Add react:`),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		];

		this.props = await this.prompt(prompts);
	}

	install() {
		const { promptValues: { npmInstall, useReact } } = this.config.getAll();

		if (npmInstall === 'yes') {
			if (useReact === 'yes') {
				this.log(`\n${ progressColor(`REACT`) } Running ${ scriptColor('npm install') }...\n`);
				this.npmInstall([
					'@types/react-router',
					'@hot-loader/react-dom',
					'@material-ui/core',
					'@material-ui/icons',
					'@material-ui/lab',
					'@material-ui/styles',
					'enzyme-adapter-react-16',
					'enzyme',
					'hoist-non-react-statics',
					'react-dom',
					'react-hot-loader',
					'react-loadable',
					'react-router-dom',
					'react-router',
					'react',
				]);
			} else {
				this.log(`\n${ progressColor(`REACT`) } Skiping ${ scriptColor('npm install') }...\n`);
			}
		}
	}
};
