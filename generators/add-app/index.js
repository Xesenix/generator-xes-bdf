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

const listTemplates = async (folder) => (await listFiles(path.resolve(__dirname, `templates/${ folder }`)))
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
        name: 'title',
        message: promptColor('Application title (used to identify it to end user): '),
        validate: validateMinLengthFactory(3),
        store: true,
      },
    ];

    this.props = await this.prompt(prompts);
    this.config.save();
  }

  configuring() {
    const { promptValues: { author } } = this.config.getAll();
    const { appName, title } = this.props;

    this.log(`\n${ progressColor(`ADD-APP`) } Configuring ${ scriptColor('package.json') }...\n`);

    this.fs.extendJSON(this.destinationPath('package.json'), {
      scripts: {
        [`${ appName }:analyze`]: `cross-env APP=${ appName } npm run analyze`,
        [`${ appName }:tdd`]: `cross-env APP=${ appName } npm run tdd`,
        [`${ appName }:test`]: `cross-env APP=${ appName } npm run test`,
        [`${ appName }:start`]: `http-server ./dist/${ appName }`,
        [`${ appName }:serve`]: `cross-env APP=${ appName } npm run serve`,
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
            title,
            author,
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
    const { appName } = this.props;

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
      ...await listTemplates('app'),
      ...await listTemplates('assets'),
      ...await listTemplates('components'),
      ...await listTemplates('src'),
      ...await listTemplates('styles'),
      // 'locales',
      // 'styles',
      'main.test.ts',
      'main.ts',
      'phaser.ts',
    ].forEach((path) => {
      this.fs.copyTpl(
        this.templatePath(path),
        this.destinationPath(`${ rootSrcPath }${ appName }/${ path }`),
        {
          author,
          appName,
          usePhaser,
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
        usePhaser,
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
