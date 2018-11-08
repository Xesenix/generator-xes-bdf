'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const editorconfig = require('editorconfig');

const validateNotEmpty = require('../../validators/not-empty');

const promptColor = chalk.magenta;
const progressColor = chalk.blue;
const scriptColor = chalk.keyword('lime');

module.exports = class extends Generator {
  async prompting() {
    this.log(`\n${ progressColor(`LINT`) } General configuration...\n`);

    const prompts = [
      {
        type: 'list',
        name: 'indentStyle',
        message: promptColor('Indentation style: '),
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

  configuring() {
    this.log(`\n${ progressColor(`LINT`) } Setting up editorconfig...\n`);
    this.fs.copyTpl(
      this.templatePath('.editorconfig'),
      this.destinationPath('.editorconfig'),
      { ...this.props },
    );

    this.log(`\n${ progressColor(`LINT`) } Setting up tslint...\n`);
    this.fs.copyTpl(
      this.templatePath('tslint.json'),
      this.destinationPath('tslint.json'),
      {
        indentStyle: this.props.indentStyle === 'tab' ? 'tabs' : 'spaces',
        indentSize: parseFloat(this.props.indentSize),
        quote: this.props.quote,
      }
    );

    this.fs.copyTpl(
      this.templatePath('.prettierrc.json'),
      this.destinationPath('.prettierrc.json'),
      {
        useTabs: this.props.indentStyle === 'tab',
        indentSize: parseFloat(this.props.indentSize),
        singleQuotes: this.props.quote === 'single',
      },
    );

    this.log(`\n${ progressColor(`LINT`) } Adding ${ scriptColor('lint:*') } scripts...\n`);
    this.fs.extendJSON(this.destinationPath('package.json'), {
      scripts: {
        'lint': 'tslint -p ./',
        'lint:fix': 'npm run prettier && tslint -p ./ --fix',
        'lint:ec:fix': 'eclint fix',
        'prettier': 'prettier --write \"**/*.{js,jsx,ts,tsx}\"',
      },
    });

    this.log(`\n${ progressColor(`LINT`) } Add linting fixing hook on ${ scriptColor('pre-commit') }...\n`);
    this.fs.extendJSON(this.destinationPath('package.json'), {
      scripts: {
        'pre-commit': 'lint:fix',
      },
    });
  }

  install() {
    const { promptValues: { npmInstall } } = this.config.getAll();

    if (npmInstall !== 'yes') {
      this.log(`\n${ progressColor(`LINT`) } Skiping ${ scriptColor('npm install') }...\n`);
      return;
    }

    this.log(`\n${ progressColor(`LINT`) } Running ${ scriptColor('npm install') }...\n`);

    // linter for fixing code according to .editorconfig setup
    this.npmInstall([
      'tslint',
      'eclint',
      'prettier',
      'tslint-config-prettier',
    ], { saveDev: true });
  }

  end() {
    this.log(`\n${ progressColor(`LINT`) } Fixing files according to linters...\n`);
    this.spawnCommandSync('npm', ['run', 'lint:fix']);
  }
};
