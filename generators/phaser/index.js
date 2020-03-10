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
		this.log(`\n${ progressColor(`PHASER`) } General configuration:\n`);

		const prompts = [
			{
				type: 'list',
				name: 'usePhaser',
				message: promptColor(`Add Phaser?`),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		];

		this.props = await this.prompt(prompts)
			.then(({ usePhaser }) => ({ usePhaser: usePhaser === 'yes' }));
	}

	configuring() {
		if (this.options.deps) {
			const { usePhaser } = this.props;

			if (usePhaser) {
				this.composeWith(require.resolve('../npm'), {});
			}
		}
	}

	async writing() {
		const { usePhaser } = this.props;

		if (usePhaser) {
			this.log(`${ progressColor(`PHASER`) } Copying files...`);

			[
				'src/types/phaser.d.ts',
				...listTemplates('src/lib/phaser'),
			].filter(Boolean)
			.forEach((path) => {
				this.fs.copyTpl(
					this.templatePath(path),
					this.destinationPath(path),
					{
						usePhaser,
					},
				);
			});
		} else {
			this.log(`${ progressColor(`PHASER`) } Skiping copy templates...`);
		}
	}

	async install() {
		const { usePhaser } = this.props;

		const { promptValues: { npmInstall } } = this.config.getAll();

		if (npmInstall === 'yes' && usePhaser) {
			this.log(`${ progressColor(`PHASER`) } Adding dependencies to ${ scriptColor('package.json') }...`);
			this.npmInstall([
				'phaser',
			]);
		} else {
			this.log(`${ progressColor(`PHASER`) } Skiping adding dependencies ${ scriptColor('package.json') }...`);
		}
	}
};
