'use strict';
const Generator = require('yeoman-generator');
const axios = require('axios');
const chalk = require('chalk');

const promptColor = chalk.magenta;
const progressColor = chalk.blue;
const scriptColor = chalk.keyword('lime');

module.exports = class extends Generator {
  async prompting() {
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
    this.config.save();
  }

  async writing() {
    this.npmInstall([
      'husky',
    ], { saveDev: true });

    if (this.props.initGitIgnore !== 'yes') {
      return;
    }

    this.log(`\n${ progressColor(`GIT`) } Downloading ${ scriptColor('.gitignore') }\n`);
    const { data } = await axios.get('https://raw.githubusercontent.com/github/gitignore/master/Node.gitignore');

    this.log(`\n${ progressColor(`GIT`) } Initializing ${ scriptColor('.gitignore') }\n`);
    this.fs.write(
      this.destinationPath('.gitignore'),
      data
    );
  }

  install() {
    if (this.props.initGit !== 'yes') {
      return;
    }
    this.log(`\n${ progressColor(`GIT`) } Initializing git...\n`);
    this.spawnCommand('git', ['init']);
  }
};
