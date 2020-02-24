'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');

const validateMinLengthFactory = require('../../validators/min-length');
const { listFiles } = require('../../helpers/functions');

const promptColor = chalk.magenta;
const progressColor = chalk.blue;
const scriptColor = chalk.keyword('lime');

const listTemplates = (folder) => listFiles(path.resolve(__dirname, `templates/${ folder }`))
	.map(x => path.relative(path.resolve(__dirname, 'templates'), x))

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.argument('name', {
			type: String,
			description: 'Generated application name.',
			required: false,
		});
		this.argument('description', {
			type: String,
			description: 'Generated application description.',
			required: false,
		});
		this.option('author', {
			type: String,
			description: 'Project author.',
		});
	}

	initializing() {
		this.composeWith(require.resolve('../lint'), {});
		this.composeWith(require.resolve('../git'), {});
		this.composeWith(require.resolve('../react'), {});
	}

	async prompting() {
		this.log(
			yosay(`Welcome to the ${ chalk.red('Black Dragon Framework') } generator!`)
		);

		this.log(`\n${ progressColor(`APP`) } General configuration...\n`);
		const prompts = [
			{
				type: 'input',
				name: 'name',
				message: promptColor('Project name: '),
				validate: validateMinLengthFactory(3),
				store: true,
			},
			{
				type: 'input',
				name: 'projectDescription',
				message: promptColor('Project description: '),
				validate: validateMinLengthFactory(0),
				store: true,
			},
			{
				type: 'input',
				name: 'author',
				message: promptColor('Author: '),
				default: '',
				validate: validateMinLengthFactory(3),
				store: true,
			},
			{
				type: 'list',
				name: 'usePhaser',
				message: promptColor(`Add phaser:`),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		];

		this.props = await this.prompt(prompts);
	}

	async configuring() {
		this.log(`\n${ progressColor(`APP`) } confirm configuration...\n`);
		await this.prompt([
			{
				type: 'list',
				name: 'npmInstall',
				message: promptColor(`Install dependencies:`),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		]);

		this.log(`\n${ progressColor(`APP`) } Adding basic scripts to ${ scriptColor('package.json') }...\n`);

		this.fs.extendJSON(this.destinationPath('package.json'), {
			name: this.props.name,
			description: this.props.projectDescription,
			version: '0.0.0',
			author: this.props.author,
			scripts: {
				'analyze': 'cross-env ANALYZE=true npm run build:prod',
				'build:dev': 'cross-env ENV=development parallel-webpack --config webpack.config.js',
				'build:prod': 'cross-env ENV=production webpack --config webpack.config.js',
				'report-coverage': 'cat ./coverage/lcov.info | coveralls',
				'serve': 'cross-env ENV=development HMR=true webpack-dev-server --config webpack.config.js',
				'start': 'http-server ./dist',
				'tdd': 'cross-env BABEL_ENV=test ENV=test karma start',
				'test': 'cross-env BABEL_ENV=test ENV=test karma start --single-run',
				'tsc': 'tsc -p tsconfig.json --diagnostics --pretty',
				'xi18n': 'ts-node ./scripts/extract.ts',
				"expose": "ngrok http --host-header=rewrite 8080",
			},
		});
	}

	async writing() {
		const { promptValues: { author, usePhaser, useReact, projectDescription } } = this.config.getAll();
		this.log(`\n${ progressColor(`APP`) } Copying files...\n`);

		[
			'.babelrc',
			'default.env',
			'example.env',
			'karma.conf.js',
			'tsconfig.json',
			'webpack.config.js',
			'scripts/extract.ts', // translations
			'src/lib/index.ts',
			'src/lib/interfaces.ts',
			'src/lib/main.test.ts',
			...(usePhaser === 'yes' ? listTemplates('src/lib/phaser') : []),
			...listTemplates('src/lib/audio'), // sound
			...listTemplates('src/lib/core'),
			...listTemplates('src/lib/data-store'), // redux
			...listTemplates('src/lib/debug'),
			...listTemplates('src/lib/di'),
			...listTemplates('src/lib/dom-helper'),
			...listTemplates('src/lib/fullscreen'),
			...listTemplates('src/lib/i18n'), // translations
			...listTemplates('src/lib/jss'),
			...listTemplates('src/lib/preload'),
			...listTemplates('src/lib/random-generator'),
			...listTemplates('src/lib/service-worker'),
			...listTemplates('src/lib/sound-scape'), // sound
			...listTemplates('src/lib/ui'),
			...listTemplates('src/lib/user'),
			...listTemplates('src/lib/utils'),
    ]
    .filter(Boolean).forEach((path) => {
			this.fs.copyTpl(
				this.templatePath(path),
				this.destinationPath(path),
				{
					author,
					usePhaser: usePhaser === 'yes',
					useReact: useReact === 'yes',
					projectDescription,
				},
			);
		});
	}

	install() {
		const { promptValues: { npmInstall, usePhaser } } = this.config.getAll();

		if (npmInstall !== 'yes') {
			this.log(`\n${ progressColor(`APP`) } Skiping npm ${ scriptColor('npm -D install') }...\n`);
			return;
		}

		this.log(`\n${ progressColor(`APP`) } Running ${ scriptColor('npm -D install') }...\n`);

		this.npmInstall([
			'@babel/plugin-transform-runtime',
			'compression-webpack-plugin',
			'compression',
			'cross-env',
			'ngrock-webpack-plugin',
			'node-gettext',
			'po-gettext-loader',
			'ts-node',
			'typescript',
			'webpack-pwa-manifest',
			'workbox-webpack-plugin',
			'xes-webpack-core',
			// locales?
		], { saveDev: true });

		this.log(`\n${ progressColor(`APP`) } Running ${ scriptColor('npm install') }...\n`);

		this.npmInstall([
			'@types/inversify',
			'inversify',
			'inversify-vanillajs-helpers',
			// fullscreen
			'fscreen',
			// datastore?
			'immer',
			'redux',
			'redux-thunk',
			'redux-logger',
			'redux-localstorage-simple',
			...(usePhaser === 'yes' ? ['phaser'] : []),
			// others
			'core-js', // @see https://github.com/babel/babel/issues/9449
			'eventemitter3', // fast event emitter
			'html-decoder',
			'lodash-es',
			'lodash',
			'math-random-seed',
			'polished',
			'reflect-metadata',
			'terser-webpack-plugin',
			'ts-loader',
			'webpack', // @see https://github.com/webpack/webpack/issues/8656
		]);
	}
};
