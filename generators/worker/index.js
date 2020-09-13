'use strict';
const chalk = require('chalk');
const path = require('path');

const Generator = require('../sub-generator');
const { listFiles } = require('../../helpers/functions');

const promptColor = chalk.magenta;
const progressColor = chalk.blue;
const scriptColor = chalk.keyword('lime');

const listTemplates = (folder) => listFiles(path.resolve(__dirname, `templates/${ folder }`))
	.map(x => path.relative(path.resolve(__dirname, 'templates'), x))

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
		Object.entries(this.props).forEach(([key, value]) => this.config.set(key, value));
	}

	async writing() {
		const { useWorker } = this.props;

		if (useWorker) {
			this.log(`${ progressColor(`WORKER`) } Copying files...`);

			listTemplates('src')
				.filter(Boolean)
				.forEach((path) => {
					this.fs.copyTpl(
						this.templatePath(path),
						this.destinationPath(path),
						{
							useWorker,
						},
					);
				});
		} else {
			this.log(`${ progressColor(`WORKER`) } Skiping copy templates...`);
		}
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
