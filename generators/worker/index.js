'use strict';
const chalk = require('chalk');

const Generator = require('../sub-generator');

const promptColor = chalk.magenta;
const progressColor = chalk.blue;
const scriptColor = chalk.keyword('lime');

module.exports = class extends Generator {
	async prompting() {
		this.log(`\n${ progressColor(`WORKER`) } General configuration:\n`);

		const prompts = [
			{
				type: 'list',
				name: 'useWorker',
				message: promptColor(`Add webworker?`),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		];

		this.props = await this.prompt(prompts)
			.then(({ useWorker }) => ({ useWorker: useWorker === 'yes' }));
	}

	async install() {
		const { promptValues: { npmInstall, useWorker } } = this.config.getAll();

		if (npmInstall === 'yes') {
			if (useWorker) {
				this.log(`${ progressColor(`WORKER`) } Adding dependencies to ${ scriptColor('package.json') }...`);
				this.npmInstall([
					'worker-loader',
				]);
			} else {
				this.log(`${ progressColor(`WORKER`) } Skiping adding dependencies ${ scriptColor('package.json') }...`);
			}
		}
	}
};
