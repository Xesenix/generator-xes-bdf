'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');

const promptColor = chalk.magenta;
const progressColor = chalk.blue;

module.exports = class extends Generator {
	async prompting() {
		this.log(`\n${ progressColor(`NPM`) } General configuration:\n`);

		const prompts = [
			{
				type: 'list',
				name: 'npmInstall',
				message: promptColor(`Install dependencies?`),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		];

		this.props = await this.prompt(prompts);
		Object.entries(this.props).forEach(([key, value]) => this.config.set(key, value));
	}
};
