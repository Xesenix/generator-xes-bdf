import { IDependencyDescriptor } from './interfaces';
import { parseDependencyDescriptor } from './parse-dependency-descriptor';

describe('di/parse-dependency-descriptor', () => {
	describe('parseDependencyDescriptor', () => {
		[
			{
				selector: 'A09_abc:defaults-6',
				expected: {
					key: 'A09_abc:defaults-6',
				},
			},
			{
				selector: 'X-abc:42-3@',
				expected: {
					key: 'X-abc:42-3',
					tag: { key: 'named', value: '' },
				},
			},
			{
				selector: 'X-abc:42-3@qwE01_00-aA',
				expected: {
					key: 'X-abc:42-3',
					tag: { key: 'named', value: 'qwE01_00-aA' },
				},
			},
			{
				selector: 'a/b\\AS0_s@qw_00-aA/dsa=a0_B-3',
				expected: {
					key: 'a/b\\AS0_s',
					tag: { key: 'qw_00-aA/dsa', value: 'a0_B-3' },
				},
			},

			{
				selector: 'A09_abc:defaults-6[]',
				expected: {
					key: 'A09_abc:defaults-6',
					multiple: true,
				},
			},
			{
				selector: 'X-abc:42-3@[]',
				expected: {
					key: 'X-abc:42-3',
					tag: { key: 'named', value: '' },
					multiple: true,
				},
			},
			{
				selector: 'X-abc:42-3@qwE01_00-aA[]',
				expected: {
					key: 'X-abc:42-3',
					tag: { key: 'named', value: 'qwE01_00-aA' },
					multiple: true,
				},
			},
			{
				selector: 'a/b\\AS0_s@qw_00-aA/dsa=a0_B-3[]',
				expected: {
					key: 'a/b\\AS0_s',
					tag: { key: 'qw_00-aA/dsa', value: 'a0_B-3' },
					multiple: true,
				},
			},

			{
				selector: 'A09_abc:defaults-6()',
				expected: {
					key: 'A09_abc:defaults-6',
					callable: true,
				},
			},
			{
				selector: 'X-abc:42-3@()',
				expected: {
					key: 'X-abc:42-3',
					tag: { key: 'named', value: '' },
					callable: true,
				},
			},
			{
				selector: 'X-abc:42-3@qwE01_00-aA()',
				expected: {
					key: 'X-abc:42-3',
					tag: { key: 'named', value: 'qwE01_00-aA' },
					callable: true,
				},
			},
			{
				selector: 'a/b\\AS0_s@qw_00-aA/dsa=a0_B-3()',
				expected: {
					key: 'a/b\\AS0_s',
					tag: { key: 'qw_00-aA/dsa', value: 'a0_B-3' },
					callable: true,
				},
			},

			{
				selector: 'A09_abc:defaults-6[]()',
				expected: {
					key: 'A09_abc:defaults-6',
					callable: true,
					multiple: true,
				},
			},
			{
				selector: 'X-abc:42-3@[]()',
				expected: {
					key: 'X-abc:42-3',
					tag: { key: 'named', value: '' },
					callable: true,
					multiple: true,
				},
			},
			{
				selector: 'X-abc:42-3@qwE01_00-aA[]()',
				expected: {
					key: 'X-abc:42-3',
					tag: { key: 'named', value: 'qwE01_00-aA' },
					callable: true,
					multiple: true,
				},
			},
			{
				selector: 'a/b\\AS0_s@qw_00-aA/dsa=a0_B-3[]()',
				expected: {
					key: 'a/b\\AS0_s',
					tag: { key: 'qw_00-aA/dsa', value: 'a0_B-3' },
					callable: true,
					multiple: true,
				},
			},
		].forEach(({ selector, expected = {} }) => {
			it(`should correctly parse '${selector}'`, async () => {
				const result = await parseDependencyDescriptor(selector);

				expect(result).toEqual({
					tag: null,
					multiple: false,
					callable: false,
					...expected,
				} as IDependencyDescriptor);
			});
		});
	});
});
