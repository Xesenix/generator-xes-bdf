# generator-xes-bdf [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Generating projects that use xes-webpack-core as base library for application configuration.

## About application template

This generator allows you to fast create multi application project. Each application can be individually setup to use features like:

### Features:

#### Preloader template 
It will track loading of lazy loaded modules in application booting phase:

![preloader]

#### React layout
Where you can setup if you want use just entry component with basic routing or some more advanced view with configuration screen
![template]
![configuration]

#### Canvas/WebGL libraries
You will get basic configuration for phaser, pixi js or both libraries at once.

#### Theming
If you choose to use [react] with basic layout you will get templating modules and configuration panel to choose current theme for user.

#### Audio
This generator comes with quite powerful library for handling soundtrack. It will allow you to change soundtrack based on user actions check [source code in this project][example-use] for more details how to achieve that. Also you will get basic sound configuration panel connected to data store.

#### Translations
You will be able to extract translations with `xi18n` scripts into [POEditor] files where you will be able to translate any string of your application.

#### Unit test
You can write unit tests for your code inside `spec` files. Templates adds basic configuration [jasmine] and [karma].

#### Environmental configuration
You can use cascading set of environmental configuration files `default.env` > `appname.env` > `appname.environmentname.env`. Variables will be available inside code via `process.env.VARIABLE_NAME`.

#### Extensible

This project uses [typescript], [webpack] with [babel] and [inversify] for handling most of code core functionalities. Templates mostly rely on [react] and [jss] mostly [material-ui] but can be replaced with any other templating and styling solution.

It's designed with modularity in mind choose your own solutions if you don't like whats is provided for you.

Most of core functionality is comming from [xes-webpack-core] and template originated when I was polishing my [ludumdare-43][example-use] project.
But you can add your own configuration in provided [webpack] configuration files.

## How to start

### Installation

First, install [Yeoman](http://yeoman.io) and generator-xes-bdf using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-xes-bdf
```

### Generating

Then generate your new project:

```bash
yo xes-bdf
```

This will create source code with libraries that you can modify as you wish. And it will also install all base dependencies including [xes-webpack-core] which is handling most of webpack configuration.

Then you will run 

```bash
yo xes-bdf:add-app
```

This will create one of multiple applications that can be run under your project. Here you will be able to choose which templates and libraries for specific application you need.

## Examples

I am using this generator for fast prototyping games. You can see the one on which this generator orginated [source project for generator templates][example-use]

## License

ISC © [Paweł Kapalla](xesenix.pl)


[npm-image]: https://badge.fury.io/js/generator-xes-bdf.svg
[npm-url]: https://npmjs.org/package/generator-xes-bdf
[travis-image]: https://travis-ci.org/xesenix/generator-xes-bdf.svg?branch=master
[travis-url]: https://travis-ci.org/xesenix/generator-xes-bdf
[daviddm-image]: https://david-dm.org/xesenix/generator-xes-bdf.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/xesenix/generator-xes-bdf
[coveralls-image]: https://coveralls.io/repos/xesenix/generator-xes-bdf/badge.svg
[coveralls-url]: https://coveralls.io/r/xesenix/generator-xes-bdf

[configuration]: /docs/configuration.png
[preloader]: /docs/preloader.png
[template]: /docs/generated.png

[babel]: https://babeljs.io/
[example-use]: https://github.com/Xesenix/ludumdare-43
[inversify]: http://inversify.io/
[jasmine]: https://jasmine.github.io/
[jss]: https://cssinjs.org
[karma]: https://karma-runner.github.io/latest/index.html
[material-ui]: https://material-ui.com/
[react]: https://reactjs.org/
[typscript]: https://www.typescriptlang.org/
[webpack]: https://webpack.js.org/
[xes-webpack-core]: https://github.com/Xesenix/xes-webpack-core
[POEditor]: https://poeditor.com/
