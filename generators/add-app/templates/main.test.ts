import 'reflect-metadata';

/**
 * Exclude entry point scripts that execute arbitrary code.
 */
const excludeRegexp: RegExp = /\.\/[a-z0-9-_\.]/;
/**
 * We need to load all test files to be included in karma. And all others to generate test coverage.
 * @see https://github.com/webpack-contrib/karma-webpack#alternative-usage
 */
const contextMain = (require as any).context('./', true, /\.(t|j)sx?$/);
contextMain
	.keys()
	.filter((p: string) => !excludeRegexp.test(p))
	.forEach(contextMain);

// add libraries that need to work with main application
require('../src/lib/main.test');
// ...
