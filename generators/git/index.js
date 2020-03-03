'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');

const { getIgnoredPaths } = require('../../helpers/functions');

const promptColor = chalk.magenta;
const progressColor = chalk.blue;
const scriptColor = chalk.keyword('lime');

module.exports = class extends Generator {
	async prompting() {
		this.log(`\n${ progressColor(`GIT`) } General configuration:\n`);

		const prompts = [
			{
				type: 'list',
				name: 'initGit',
				message: promptColor(`Initialize git: `),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
			{
				type: 'list',
				name: 'initGitIgnore',
				message: promptColor(`Initialize ${ scriptColor('.gitignore') }: `),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		];

		this.props = await this.prompt(prompts);
	}

	async writing() {
		if (this.props.initGitIgnore !== 'yes') {
			return;
		}

		this.log(`${ progressColor(`GIT`) } Downloading ${ scriptColor('.gitignore') }...`);
		const ignoreContent = await getIgnoredPaths();

		this.log(`${ progressColor(`GIT`) } Initializing ${ scriptColor('.gitignore') }...`);
		this.fs.write(
			this.destinationPath('.gitignore'),
			ignoreContent,
		);
	}

	async install() {
		const { promptValues: { npmInstall } } = this.config.getAll();

		if (npmInstall === 'yes') {
			this.log(`${ progressColor(`GIT`) } Adding dependencies to ${ scriptColor('package.json') }...`);
			this.npmInstall([
				'husky',
			], { saveDev: true });
		} else {
			this.log(`${ progressColor(`GIT`) } Skiping adding dependencies ${ scriptColor('package.json') }...`);
		}
	}
};
