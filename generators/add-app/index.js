'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const path = require('path');

const validateMinLengthFactory = require('../../validators/min-length');
const { listFiles } = require('../../helpers/functions');

const promptColor = chalk.magenta;
const progressColor = chalk.blue;
const scriptColor = chalk.keyword('lime');
const rootSrcPath = '';

const listTemplates = (folder) => listFiles(path.resolve(__dirname, `templates/${ folder }`))
  .map(x => path.relative(path.resolve(__dirname, 'templates'), x))

module.exports = class extends Generator {

	async prompting() {
		this.log(`\n${ progressColor(`ADD-APP`) } Adding new application...\n`);

		const prompts = [
			{
				type: 'input',
				name: 'appName',
				message: promptColor('Application name (used to identify it in code): '),
				validate: validateMinLengthFactory(3),
				store: true,
			},
			{
				type: 'input',
				name: 'appTitle',
				message: promptColor('Application title (used to identify it to end user): '),
				validate: validateMinLengthFactory(3),
				store: true,
			},
			{
				type: 'input',
				name: 'appDescription',
				message: promptColor('Application description: '),
				validate: validateMinLengthFactory(3),
				store: true,
			},
			{
				type: 'input',
				name: 'appUrl',
				message: promptColor('Application url (where will it be available): '),
				validate: validateMinLengthFactory(3),
				store: true,
			},
		];

		this.props = await this.prompt(prompts);
		this.config.save();
	}

	configuring() {
		const { promptValues: { author } } = this.config.getAll();
		const { appName, appTitle, appDescription, appUrl } = this.props;

		this.log(`\n${ progressColor(`ADD-APP`) } Configuring ${ scriptColor('package.json') }...\n`);

		this.fs.extendJSON(this.destinationPath('package.json'), {
			scripts: {
				[`${ appName }:analyze`]: `cross-env APP=${ appName } npm run analyze`,
				[`${ appName }:check`]: `npm run lint && cross-env CHECK_TYPESCRIPT=true npm run ${ appName }:test`,
				[`${ appName }:tdd`]: `cross-env APP=${ appName } npm run tdd`,
				[`${ appName }:test`]: `cross-env APP=${ appName } npm run test`,
				[`${ appName }:start`]: `http-server ./dist/${ appName }`,
				[`${ appName }:serve`]: `cross-env APP=${ appName } npm run serve`,
				[`${ appName }:serve:expose`]: `cross-env EXPOSE=ngrok npm run ${ appName }:serve`,
				[`${ appName }:build:dev`]: `cross-env APP=${ appName } npm run build:dev`,
				[`${ appName }:build:prod`]: `cross-env APP=${ appName } npm run build:prod`,
				[`${ appName }:xi18n`]: `cross-env APP=${ appName } ts-node ./scripts/extract.ts`,
			},
			apps: {
				[appName]: {
					'rootDir': `${ rootSrcPath }${ appName }`,
					'outDir': `dist/${ appName }`,
					'main': [
						'main.ts'
					],
					'moduleImportPaths': [
						rootSrcPath,
						'src',
					].filter(Boolean),
					'test': 'main.test.ts',
					'templateData': {
						title: appTitle,
						themeColor: '#fff',
						author,
						description: appDescription,
						url: appUrl,
					},
					'assets': [
						'assets',
					],
					'template': 'templates/index.html',
					'styles': [
						'styles/main.scss',
					],
					'stylesImportPaths': [
						`${ rootSrcPath }${ appName }/styles`,
						`${ rootSrcPath }styles`,
					],
					'vendor': []
				}
			}
		});
	}

	async writing() {
		this.log(`\n${ progressColor(`ADD-APP`) } Generating files...\n`);
		const { promptValues: { author, usePhaser } } = this.config.getAll();
		const { appName, appTitle, appDescription, appUrl } = this.props;

		// copy ejs templates without processing
		[
			'templates/index.html',
		].forEach((path) => {
			this.fs.copy(
				this.templatePath(path),
				this.destinationPath(`${ rootSrcPath }${ appName }/${ path }`),
			);
		});

		// copy templates with processing ejs templates fragments
		[
			...listTemplates('app'),
			...listTemplates('assets'),
			...listTemplates('components/core'),
			...listTemplates('components/language'),
			...listTemplates('components/layouts'),
			...listTemplates('components/loader'),
			...listTemplates('components/menu'),
			...listTemplates('components/theme'),
			...listTemplates('components/views'),
			...listTemplates('data'),
			...listTemplates('locales'),
			...listTemplates('src'),
			...listTemplates('styles'),
			// 'locales',
			// 'styles',
			'main.test.ts',
			'main.ts',
			...(usePhaser === 'yes' ? [
				'phaser.ts',
				...listTemplates('components/phaser-view'),
			] : []),
		].filter(Boolean).forEach((path) => {
			this.fs.copyTpl(
				this.templatePath(path),
				this.destinationPath(`${ rootSrcPath }${ appName }/${ path }`),
				{
					author,
					appName,
					usePhaser: usePhaser === 'yes',
					appTitle,
					appUrl,
					appDescription,
				},
			);
		});

		// webpack configuration file needs to be outside of application source code folder
		// so that it wont be loaded during test execution
		this.fs.copyTpl(
			this.templatePath('webpack.config.js'),
			this.destinationPath(`webpack.${ appName }.config.js`),
			{
				author,
				appName,
				usePhaser: usePhaser === 'yes',
				appTitle,
				appUrl,
				appDescription,
			},
		);
	}

	end() {
		const { appName } = this.props;
		this.log(`\n${ progressColor(`ADD-APP`) } Fixing files according to linters...\n`);
		this.spawnCommandSync('npm', ['run', 'lint:fix']);

		this.log(`\n${ progressColor(`ADD-APP`) } Extracting translation segments...\n`);
		this.spawnCommandSync('npm', ['run', `${ appName }:xi18n`]);
	}
};
