'use strict';
const chalk = require('chalk');

const Generator = require('../sub-generator');

const promptColor = chalk.magenta;
const progressColor = chalk.blue;
const scriptColor = chalk.keyword('lime');

module.exports = class extends Generator {
	async prompting() {
		this.log(`\n${ progressColor(`REACT`) } General configuration:\n`);

		const prompts = [
			{
				type: 'list',
				name: 'useReact',
				message: promptColor(`Add React?`),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		];

		this.props = await this.prompt(prompts)
			.then(({ useReact }) => ({ useReact: useReact === 'yes' }));
		Object.entries(this.props).forEach(([key, value]) => this.config.set(key, value));
	}

	configuring() {
		if (this.options.deps) {
			const { useReact } = this.props;

			if (useReact) {
				this.composeWith(require.resolve('../npm'), {});
			}
		}
	}

	async install() {
		const { useReact } = this.props;
		const { promptValues: { npmInstall } } = this.config.getAll();

		if (npmInstall === 'yes' && useReact) {
			this.log(`${ progressColor(`REACT`) } Adding dependencies to ${ scriptColor('package.json') }...`);
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
			this.log(`${ progressColor(`REACT`) } Skiping adding dependencies ${ scriptColor('package.json') }...`);
		}
	}
};
