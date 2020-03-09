'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-xes-bdf:app', () => {
	beforeAll(() => {
		return helpers
			.run(path.join(__dirname, '../generators/app'))
			.withOptions({
				skipCache: false,
				skipInstall: true,
			})
			.withPrompts({
				name: 'Test',
				projectDescription: 'Description',
				author: 'Tester',
				npmInstall: 'yes',
				usePhaser: 'yes',
				usePixi: 'yes',
				useReact: 'yes',
				indentStyle: 'tab',
				indentSize: '2',
				quote: 'single',
				initGit: 'yes',
				initGitIgnore: 'yes',
			});
	});

	it('creates files', () => {
		assert.file([
			'dummyfile.txt',
		]);
	});
});
