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
    ];

    this.props = await this.prompt(prompts);
    this.config.save();
  }

  writing() {
    this.log(`\n${ progressColor(`LINT`) } Setting up editorconfig...\n`);
    this.fs.copyTpl(
      this.templatePath('.editorconfig'),
      this.destinationPath('.editorconfig'),
      { ...this.props },
    );

    this.log(`\n${ progressColor(`LINT`) } Adding ${ scriptColor('lint:ec:fix') } script...\n`);
    this.fs.extendJSON(this.destinationPath('package.json'), {
      scripts: {
        'lint:ec:fix': 'eclint fix',
        'pre-commit': 'lint:ec:fix',
      },
    });
  }

  install() {
    this.log(`\n${ progressColor(`LINT`) } Installing editorconfig linter...\n`);

    // linter for fixing code according to .editorconfig setup
    this.npmInstall([
      'eclint',
    ], { saveDev: true });
  }

  end() {
    this.log(`\n${ progressColor(`LINT`) } Fixing files according to editorconfig...\n`);
    this.spawnCommand('npm', ['run', 'lint:ec:fix']);
  }
};
