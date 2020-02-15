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
  }

  async prompting() {
    this.log(
      yosay(`Welcome to the ${ chalk.red('BDF') } generator!`)
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
        default: 'Xesenix',
        validate: validateMinLengthFactory(3),
        store: true,
      },
      {
        type: 'list',
        name: 'typescript',
        message: promptColor(`Typescript:`),
        default: 'yes',
        choices: ['yes', 'no'],
        store: true,
      },
      {
        type: 'list',
        name: 'styles',
        message: promptColor(`Styles:`),
        default: 'scss',
        choices: ['scss', 'css', 'jss'],
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
        'tsc': 'tsc -p tsconfig.json --diagnostics --pretty',
        'report-coverage': 'cat ./coverage/lcov.info | coveralls',
        'analyze': 'cross-env ANALYZE=true npm run build:prod',
        'tdd': 'cross-env BABEL_ENV=test ENV=test karma start',
        'test': 'cross-env BABEL_ENV=test ENV=test karma start --single-run',
        'start': 'http-server ./dist',
        'serve': 'cross-env ENV=development HMR=true webpack-dev-server --config webpack.config.js',
        "expose": "ngrok http --host-header=rewrite 8080",
        'build:dev': 'cross-env ENV=development parallel-webpack --config webpack.config.js',
        'build:prod': 'cross-env ENV=production webpack --config webpack.config.js',
        'xi18n': 'ts-node ./scripts/extract.ts',
      },
    });
  }

  async writing() {
    const { promptValues: { usePhaser } } = this.config.getAll();
    this.log(`\n${ progressColor(`APP`) } Copying files...\n`);

    [
      '.babelrc',
      '.env.default',
      '.env.example',
      'karma.conf.js',
      'tsconfig.json',
      'webpack.config.js',
      'scripts/extract.ts',
      'src/lib/index.ts',
      'src/lib/interfaces.ts',
      'src/lib/main.test.ts',
      // TODO: need to move those to separate repositories
      ...listTemplates('src/lib/data-store'),
      ...listTemplates('src/lib/di'),
      ...listTemplates('src/lib/debug'),
      ...listTemplates('src/lib/fullscreen'),
      ...listTemplates('src/lib/i18n'),
      ...(usePhaser === 'yes' ? listTemplates('src/lib/phaser') : []),
      ...listTemplates('src/lib/service-worker'),
      ...listTemplates('src/lib/sound'),
      ...listTemplates('src/lib/sound-scape'),
      // ...listTemplates('src/lib/sound-scape-debug'), // TODO: requires additional dependencies vis.js
      ...listTemplates('src/lib/ui'),
      ...listTemplates('src/lib/utils'),
    ].filter(Boolean).forEach((path) => {
      this.fs.copy(
        this.templatePath(path),
        this.destinationPath(path),
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
      'cross-env',
      'xes-webpack-core',
      'typescript',
      'ts-node',
      // locales?
      'node-gettext',
      'po-gettext-loader',
      'compression-webpack-plugin',
      'ngrock-webpack-plugin',
      'webpack-pwa-manifest',
      'workbox-webpack-plugin',
    ], { saveDev: true });

    this.log(`\n${ progressColor(`APP`) } Running ${ scriptColor('npm install') }...\n`);

    this.npmInstall([
      '@types/inversify',
      'inversify',
      'inversify-vanillajs-helpers',
      // fullscreen
      'fscreen',
      // react?
      'react-hot-loader',
      'react-loadable',
			// jss
			'@material-ui/core',
			'@material-ui/icons',
			'@material-ui/lab',
			// datastore?
			'redux',
			'redux-thunk',
			'redux-logger',
			'redux-localstorage-simple',
			...(usePhaser === 'yes' ? ['phaser'] : []),
			'immer',
			// react
			'@hot-loader/react-dom',
			'hoist-non-react-statics',
			'react-dom',
			'react-hot-loader',
			'react-loadable',
			'react-router-dom',
			'react-router',
			'react',
			// others
			'core-js@2', // @see https://github.com/babel/babel/issues/9449
			'eventemitter3', // fast event emitter
			'html-decoder',
			'lodash',
			'polished',
			'reflect-metadata',
			'webpack@4.28', // @see https://github.com/webpack/webpack/issues/8656
		]);
	}
};
