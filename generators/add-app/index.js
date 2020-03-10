'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const path = require('path');

const validateMinLengthFactory = require('../../validators/min-length');
const { listFiles } = require('../../helpers/functions');

const promptColor = chalk.magenta;
const progressColor = chalk.blue;
const scriptColor = chalk.keyword('lime');
const rootSrcPath = 'applications/';

const listTemplates = (folder) => listFiles(path.resolve(__dirname, `templates/${ folder }`))
	.map(x => path.relative(path.resolve(__dirname, 'templates'), x))

module.exports = class extends Generator {

	async prompting() {
		this.log(`\n${ progressColor(`ADD-APP`) } Adding new application:`);

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
			{
				type: 'list',
				name: 'addRouting',
				message: promptColor(`Add routing modules?`),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
			{
				type: 'list',
				name: 'addLayout',
				message: promptColor(`Add layout modules?`),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
			{
				type: 'list',
				name: 'useSound',
				message: promptColor(`Add audio modules?`),
				default: 'yes',
				choices: ['yes', 'no'],
				store: true,
			},
		];

		this.props = await this.prompt(prompts).then((props) => ({
			...props,
			addRouting: props.addRouting === 'yes',
			addLayout: props.addLayout === 'yes',
			useSound: props.useSound === 'yes',
		}));
		this.config.save();
	}

	initializing() {
		this.composeWith(require.resolve('../react'), { deps: false });
		this.composeWith(require.resolve('../phaser'), { deps: false });
		this.composeWith(require.resolve('../pixi'), { deps: false });
		this.composeWith(require.resolve('../worker'), { deps: false });
		this.composeWith(require.resolve('../npm'), {});
	}

	configuring() {
		const { promptValues: { author } } = this.config.getAll();
		const {
			appName,
			appTitle,
			appDescription,
			appUrl,
		} = this.props;

		this.log(`${ progressColor(`ADD-APP`) } Configuring ${ scriptColor('package.json') }...`);

		this.fs.extendJSON(this.destinationPath('package.json'), {
			scripts: {
				[`${ appName }:analyze`]: `cross-env APP=${ appName } npm run analyze`,
				[`${ appName }:build:dev`]: `cross-env APP=${ appName } npm run build:dev`,
				[`${ appName }:build:prod`]: `cross-env APP=${ appName } npm run build:prod`,
				[`${ appName }:check`]: `npm run lint && cross-env CHECK_TYPESCRIPT=true npm run ${ appName }:test`,
				[`${ appName }:di`]: `cross-env APP=${ appName } DI=true npm run serve`,
				[`${ appName }:start`]: `http-server ./dist/${ appName }`,
				[`${ appName }:serve`]: `cross-env APP=${ appName } npm run serve`,
				[`${ appName }:serve:expose`]: `cross-env EXPOSE=ngrok npm run ${ appName }:serve`,
				[`${ appName }:tdd`]: `cross-env APP=${ appName } npm run tdd`,
				[`${ appName }:test`]: `cross-env APP=${ appName } npm run test`,
				[`${ appName }:xi18n`]: `cross-env APP=${ appName } ts-node ./scripts/extract.ts`,
			},
			apps: {
				[appName]: {
					'rootDir': `${ rootSrcPath }${ appName }`,
					'outDir': `dist/${ appName }`,
					'main': [
						'main.ts',
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
					'vendor': [],
				},
			},
		});
	}

	async writing() {
		this.log(`${ progressColor(`ADD-APP`) } Generating files:`);
		const {
			promptValues: {
				author,
				useReact,
				usePixi,
				usePhaser,
			},
		} = this.config.getAll();
		const {
			appName,
			appTitle,
			appDescription,
			appUrl,
			addRouting,
			addLayout,
			useSound,
		} = this.props;
		const context = {
			author,
			appName,
			addRouting,
			addLayout,
			usePhaser: usePhaser === 'yes',
			useReact: useReact === 'yes',
			usePixi: usePixi === 'yes',
			useSound,
			appTitle,
			appUrl,
			appDescription,
			rootSrcPath,
		};

		// copy ejs templates without processing
		[
			'templates/index.html',
		].forEach((path) => {
			this.fs.copy(
				this.templatePath(path),
				this.destinationPath(`${ rootSrcPath }${ appName }/${ path }`),
			);
		});

		this.log(`${ progressColor(`ADD-APP`) } Template setup:`);

		// copy templates with processing ejs templates fragments
		[
			'app/app.module.ts',
			'app/ie.ts',
			'app/preloader.ts',
			...listTemplates('assets'),
			...(useReact === 'yes' ? [
				'app/app.tsx',
				...(addRouting ? [
					'app/app.routing.tsx',
					...listTemplates('components/views/configuration-view'),
					...listTemplates('components/views/intro-view'),
				] : []),
				...(addLayout ? [
					...listTemplates('components/layouts'),
					...listTemplates('components/ui/core'),
					...listTemplates('components/ui/language'),
					...listTemplates('components/ui/loader'),
					...listTemplates('components/ui/menu'),
					...listTemplates('components/ui/theme'),
				] : []),
				...listTemplates('src/theme'),
				...listTemplates('src/themes'),
			] : [
				'app/app.ts',
			]),
			...(useSound ? [
				'assets/soundtrack.ogg',
				...listTemplates('src/sound-director'),
			] : []),
			...listTemplates('data'),
			...listTemplates('locales'),
			...listTemplates('src/i18n'),
			...listTemplates('src/ui'),
			...listTemplates('styles'),
			'app.yo-rc.json',
			'di.ts',
			'main.test.ts',
			'main.ts',
			...(usePixi === 'yes' ? listTemplates('src/pixi') : []),
			...(usePhaser === 'yes' ? listTemplates('src/phaser') : []),
		].filter(Boolean).forEach((path) => {
			this.fs.copyTpl(
				this.templatePath(path),
				this.destinationPath(`${ rootSrcPath }${ appName }/${ path }`),
				context
			);
		});

		// webpack configuration file needs to be outside of application source code folder
		// so that it wont be loaded during test execution
		this.fs.copyTpl(
			this.templatePath('webpack.config.js'),
			this.destinationPath(`webpack.${ appName }.config.js`),
			context
		);

		this.fs.extendJSON(
			this.destinationPath(`${ rootSrcPath }${ appName }/app.yo-rc.json`),
			context
		);

		this.fs.copyTpl(
			this.templatePath('example.env'),
			this.destinationPath(`${ appName }.env`),
			context
		);
	}

	end() {
		const { appName } = this.props;
		this.log(`${ progressColor(`ADD-APP`) } Fixing files according to linters:`);
		this.spawnCommandSync('npm', ['run', 'lint:fix']);

		this.log(`${ progressColor(`ADD-APP`) } Extracting translation segments:`);
		this.spawnCommandSync('npm', ['run', `${ appName }:xi18n`]);
	}
};
