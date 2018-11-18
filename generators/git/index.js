'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');

const { getIgnoredPaths } = require('../../helpers/functions');

const promptColor = chalk.magenta;
const progressColor = chalk.blue;
const scriptColor = chalk.keyword('lime');

module.exports = class extends Generator {
  async prompting() {
    this.log(`\n${ progressColor(`GIT`) } General configuration...\n`);

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

    this.log(`\n${ progressColor(`GIT`) } Downloading ${ scriptColor('.gitignore') }\n`);
    const ignoreContent = await getIgnoredPaths();

    this.log(`\n${ progressColor(`GIT`) } Initializing ${ scriptColor('.gitignore') }\n`);
    this.fs.write(
      this.destinationPath('.gitignore'),
      ignoreContent,
    );
  }

  configuring() {
    if (this.props.initGit !== 'yes') {
      return;
    }
    this.log(`\n${ progressColor(`GIT`) } Initializing git...\n`);
    this.spawnCommandSync('git', ['init']);
  }

  install() {
    const { promptValues: { npmInstall } } = this.config.getAll();

    if (npmInstall === 'yes') {
      this.log(`\n${ progressColor(`GIT`) } Running ${ scriptColor('npm install') }...\n`);
      this.npmInstall([
        'husky',
      ], { saveDev: true });
    } else {
      this.log(`\n${ progressColor(`GIT`) } Skiping ${ scriptColor('npm install') }...\n`);
    }
  }
};
