'use strict';
const chalk = require('chalk');

const Generator = require('../sub-generator');

const promptColor = chalk.magenta;
const progressColor = chalk.blue;
const scriptColor = chalk.keyword('lime');

module.exports = class extends Generator {
	async prompting() {
		this.log(`\n${ progressColor(`PIXI`) } General configuration:\n`);

		const prompts = [
			{
				type: 'list',
				name: 'usePixi',
				message: promptColor(`Add pixi.js?`),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		];

		this.props = await this.prompt(prompts)
			.then(({ usePixi }) => ({ usePixi: usePixi === 'yes' }));
	}

	configuring() {
		if (this.options.deps) {
			const { usePixi } = this.props;

			if (usePixi) {
				this.composeWith(require.resolve('../npm'), {});
			}
		}
	}

	async install() {
		const { usePixi } = this.props;
		const { promptValues: { npmInstall } } = this.config.getAll();

		if (npmInstall === 'yes') {
			if (usePixi) {
				this.log(`${ progressColor(`PIXI`) } Adding dependencies to ${ scriptColor('package.json') }...`);
				this.npmInstall([
					'@types/pixi.js',
					'pixi.js',
				]);
			} else {
				this.log(`${ progressColor(`PIXI`) } Skiping adding dependencies ${ scriptColor('package.json') }...`);
			}
		}
	}
};
