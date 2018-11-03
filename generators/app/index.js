'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

const validateMinLengthFactory = require('../../validators/min-length');
const validateNotEmpty = require('../../validators/not-empty');

const promptColor = chalk.magenta;
const progressColor = chalk.blue;

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
      yosay(`Welcome to the ${chalk.red('BDF')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: promptColor('Project name: '),
        validate: validateMinLengthFactory(3),
      },
      {
        type: 'input',
        name: 'description',
        message: promptColor('Project description: '),
        validate: validateMinLengthFactory(0),
      },
      {
        type: 'input',
        name: 'author',
        message: promptColor('Author: '),
        default: 'Xesenix',
        validate: validateMinLengthFactory(3),
        store: true,
      },
    ];

    this.props = await this.prompt(prompts);
  }

  configuring() {

  }

  writing() {
    this.log(progressColor(`Copying files...`));
    this.fs.extendJSON(this.destinationPath('package.json'), {
      name: this.props.name,
      description: this.props.description,
      author: this.props.author,
    });

    this.fs.copy(
      this.templatePath('karma.conf.js'),
      this.destinationPath('karma.conf.js'),
    );

    this.fs.copy(
      this.templatePath('tsconfig.json'),
      this.destinationPath('tsconfig.json'),
    );

    this.fs.copy(
      this.templatePath('tslint.json'),
      this.destinationPath('tslint.json'),
    );

    this.fs.copy(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
    );

    // this.fs.copy(
    //   this.templatePath('src/*'),
    //   this.destinationPath('src/*'),
    // );
  }

  install() {
    this.log(progressColor(`Instaling dependencies...`));
    this.npmInstall([
      'inversify',
      '@types/inversify',
      'inversify-vanillajs-helpers',
      // react?
      'react-hot-loader',
      // datastore?
      'redux',
    ]);

    this.npmInstall([
      'cross-env',
      'xes-webpack-core',
      'typescript',
      'tslint',
      'ts-node',
      // locales?
      'node-gettext',
      'po-gettext-loader',
    ], { saveDev: true });

    this.installDependencies({
      npm: true,
      bower: false,
    });
  }
};
