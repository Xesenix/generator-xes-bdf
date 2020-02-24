<% if(useReact) { %>if import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'reflect-metadata';

Enzyme.configure({ adapter: new Adapter() });

<% } %>const excludeRegexp: RegExp = /.*\/(main|index|interfaces)\./;

const filter = (contextLib) => contextLib
	.keys()
	.filter((p: string) => !excludeRegexp.test(p))
	.forEach(contextLib);

/**
 * We need to load all test files to be included in karma. And all others to generate test coverage.
 * @see https://github.com/webpack-contrib/karma-webpack#alternative-usage
 */
filter((require as any).context('./di', true, /\.(t|j)sx?$/));
filter((require as any).context('./audio', true, /\.(t|j)sx?$/));
filter((require as any).context('./sound-scape', true, /\.(t|j)sx?$/));
filter((require as any).context('./i18n', true, /\.(t|j)sx?$/));

