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

	async writing() {
		const { usePixi } = this.props;

		if (usePixi) {
			this.log(`${ progressColor(`PIXI`) } Copying files...`);

			[
				'src/types/pixi.d.ts',
				...listTemplates('src/lib/pixi'),
			].filter(Boolean)
				.forEach((path) => {
					this.fs.copyTpl(
						this.templatePath(path),
						this.destinationPath(path),
						{
							usePixi,
						},
					);
				});
		} else {
			this.log(`${ progressColor(`PIXI`) } Skiping copy templates...`);
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
