'use strict';
const chalk = require('chalk');

const Generator = require('../sub-generator');
const validateNotEmpty = require('../../validators/not-empty');

const promptColor = chalk.magenta;
const progressColor = chalk.blue;
const scriptColor = chalk.keyword('lime');

module.exports = class extends Generator {
	async prompting() {
		this.log(`\n${ progressColor(`LINT`) } General configuration:\n`);

		const prompts = [
			{
				type: 'list',
				name: 'indentStyle',
				message: promptColor('Indentation style: '), // spaces don't work best with jsdocs
				default: 'tab',
				choices: ['tab', 'space'],
				validate: validateNotEmpty,
				store: true,
			},
			{
				type: 'list',
				name: 'indentSize',
				message: promptColor('Indentation size: '),
				default: '2',
				choices: ['1', '2', '4'],
				validate: validateNotEmpty,
				store: true,
			},
			{
				type: 'list',
				name: 'quote',
				message: promptColor('Quotes: '),
				default: 'single',
				choices: ['single', 'double'],
				validate: validateNotEmpty,
				store: true,
			},
		];

		this.props = await this.prompt(prompts);
	}

	async configuring() {
		this.log(`${ progressColor(`LINT`) } Setting up ${ scriptColor('.editorconfig') }...`);
		this.fs.copyTpl(
			this.templatePath('.editorconfig'),
			this.destinationPath('.editorconfig'),
			this.props,
		);

		this.log(`${ progressColor(`LINT`) } Setting up ${ scriptColor('tslint.json') }...`);
		this.fs.copyTpl(
			this.templatePath('tslint.json'),
			this.destinationPath('tslint.json'),
			this.props,
		);

		this.log(`${ progressColor(`LINT`) } Setting up ${ scriptColor('.prettierrc') }...`);
		this.fs.copyTpl(
			this.templatePath('.prettierrc.json'),
			this.destinationPath('.prettierrc.json'),
			this.props,
		);

		this.log(`${ progressColor(`LINT`) } Adding ${ scriptColor('lint:*') } scripts...`);
		this.fs.extendJSON(this.destinationPath('package.json'), {
			scripts: {
				"lint": "tslint -p ./",
				"lint:fix": "tslint -p ./ --fix",
				"pre-commit": "lint:fix",
			},
		});

		this.log(`${ progressColor(`LINT`) } Add linting fixing hook on ${ scriptColor('pre-commit') }...`);
		this.fs.extendJSON(this.destinationPath('package.json'), {
			scripts: {
				'pre-commit': 'lint:fix',
			},
		});
	}

	async install() {
		const { promptValues: { npmInstall } } = this.config.getAll();

		if (npmInstall !== 'yes') {
			this.log(`${ progressColor(`LINT`) } Skiping adding dependencies ${ scriptColor('package.json') }...`);
			return;
		}

		this.log(`${ progressColor(`LINT`) } Adding dev dependencies to ${ scriptColor('package.json') }...`);

		// linter for fixing code according to .editorconfig setup
		this.npmInstall([
			'tslint',
			// 'eslint',
			// 'prettier',
			'tslint-react',
			'tslint-config-prettier',
			'tslint-eslint-rules',
		], { saveDev: true });
	}

	end() {
		this.log(`${ progressColor(`LINT`) } Fixing files according to linters...`);
		this.spawnCommandSync('npm', ['run', 'lint:fix']);
	}
};
