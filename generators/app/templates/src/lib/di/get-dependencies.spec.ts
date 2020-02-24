import { Container } from 'inversify';

import { getDependencies } from './get-dependencies';

describe('di/get-dependencies', () => {
	describe('getDependencies', () => {
		let container: Container;

		beforeEach(() => {
			container = new Container();

			container.bind<string>('multiple:_const-A0').toConstantValue('A').whenTargetNamed('');
			container.bind<string>('multiple:_const-A0').toConstantValue('B').whenTargetIsDefault();
			container.bind<Promise<string>>('multiple:_Creator-0').toProvider(() => async () => 'C').whenTargetNamed('');
			container.bind<string>('multiple:_Creator-0').toFactory(() => () => 'D').whenTargetIsDefault();
			container.bind<string>('multiple:_const-A0').toConstantValue('E').whenTargetNamed('target');
			container.bind<string>('multiple:_const-A0').toConstantValue('F').whenTargetNamed('Target-diff_01');
			container.bind<string>('multiple:_const-A0').toConstantValue('G').whenTargetNamed('target');
			container.bind<Promise<string>>('multiple:_Creator-0').toProvider(() => async () => 'H').whenTargetNamed('target');
			container.bind<Promise<string>>('multiple:_Creator-0').toProvider(() => async () => 'I').whenTargetNamed('Target-diff_01');
			container.bind<string>('multiple:_Creator-0').toFactory(() => () => 'J').whenTargetNamed('target');
			container.bind<string>('multiple:defaults').toConstantValue('X').whenTargetIsDefault();
			container.bind<string>('multiple:defaults').toConstantValue('Y').whenTargetIsDefault();
			container.bind<string>('constant:tagged').toConstantValue('0').whenTargetIsDefault();
			container.bind<string>('constant:tagged').toConstantValue('1').whenTargetNamed('_with-Name0');
			container.bind<string>('constant:tagged').toConstantValue('2').whenTargetTagged('named', '_with-Name0');
			container.bind<string>('constant:tagged').toConstantValue('3').whenTargetTagged('_s0m3-n4m3', 'p4ssW0rd');
			container.bind<string>('constant:tagged').toConstantValue('4').whenTargetTagged('_s0m3-n4m3', 'p4ssW0rd');
			container.bind<string>('build:tagged').toProvider(() => async () => '0').whenTargetIsDefault();
			container.bind<string>('build:tagged').toProvider(() => async () => '1').whenTargetNamed('_with-Name0');
			container.bind<string>('build:tagged').toFactory(() => () => '2').whenTargetTagged('named', '_with-Name0');
			container.bind<string>('build:tagged').toProvider(() => async () => '3').whenTargetTagged('_s0m3-n4m3', 'p4ssW0rd');
			container.bind<string>('build:tagged').toFactory(() => () => '4').whenTargetTagged('_s0m3-n4m3', 'p4ssW0rd');
		});

		[
			{
				description: 'get default from multiple defined defaults',
				selector: ['multiple:defaults'],
				error: true,
			},
			{
				description: 'get default from multiple defined defaults',
				selector: ['multiple:defaults[]'],
				expected: [['X', 'Y']],
			},
			{
				description: 'get default value',
				selector: ['multiple:_const-A0'],
				expected: ['B'],
			},
			{
				description: 'get default value and call as function (for providers and factories should resolve them)',
				selector: ['multiple:_Creator-0()'],
				expected: ['D'],
			},
			{
				description: 'getNamed empty',
				selector: ['multiple:_const-A0@'],
				expected: ['A'],
			},
			{
				description: 'getNamed empty and call as function (for providers and factories should resolve them)',
				selector: ['multiple:_Creator-0@()'],
				expected: ['C'],
			},
			{
				description: 'getNamed target when called on multiple defined dependencies',
				selector: ['multiple:_const-A0@target'],
				error: true,
			},
			{
				description: 'getNamed target when called on multiple defined dependencies',
				selector: ['multiple:_Creator-0@target()'],
				error: true,
			},
			{
				description: 'getNamed Target-diff_01',
				selector: ['multiple:_const-A0@Target-diff_01'],
				expected: ['F'],
			},
			{
				description: 'getNamed Target-diff_01 and call as function (for providers and factories should resolve them)',
				selector: ['multiple:_Creator-0@Target-diff_01()'],
				expected: ['I'],
			},
			{
				description: 'getAll',
				selector: ['multiple:_const-A0[]'],
				expected: [['A', 'B', 'E', 'F', 'G']],
			},
			{
				description: 'getAll and call as function (for providers and factories should resolve them)',
				selector: ['multiple:_Creator-0[]()'],
				expected: [['C', 'D', 'H', 'I', 'J']],
			},
			{
				description: 'getAllNamed empty',
				selector: ['multiple:_const-A0@[]'],
				expected: [['A']],
			},
			{
				description: 'getAllNamed empty and call as function (for providers and factories should resolve them)',
				selector: ['multiple:_Creator-0@[]()'],
				expected: [['C']],
			},
			{
				description: 'getAllNamed target',
				selector: ['multiple:_const-A0@target[]'],
				expected: [['E', 'G']],
			},
			{
				description: 'getAllNamed target and call as function (for providers and factories should resolve them)',
				selector: ['multiple:_Creator-0@target[]()'],
				expected: [['H', 'J']],
			},
			{
				description: 'getAllNamed Target-diff_01',
				selector: ['multiple:_const-A0@Target-diff_01[]'],
				expected: [['F']],
			},
			{
				description: 'getAllNamed Target-diff_01 and call as function (for providers and factories should resolve them)',
				selector: ['multiple:_Creator-0@Target-diff_01[]()'],
				expected: [['I']],
			},
			{
				description: 'getTagged _s0m3-n4m3=p4ssW0rd',
				selector: ['constant:tagged@_s0m3-n4m3=p4ssW0rd'],
				error: true,
			},
			{
				description: 'getAllTagged _s0m3-n4m3=p4ssW0rd',
				selector: ['constant:tagged@_s0m3-n4m3=p4ssW0rd[]'],
				expected: [['3', '4']],
			},
			{
				description: 'getTagged named=_with-Name0',
				selector: ['constant:tagged@named=_with-Name0'],
				error: true,
			},
			{
				description: 'getAllTagged named=_with-Name0',
				selector: ['constant:tagged@named=_with-Name0[]'],
				expected: [['1', '2']],
			},
			{
				description: 'getTagged _s0m3-n4m3=p4ssW0rd and call as function (for providers and factories should resolve them)',
				selector: ['build:tagged@_s0m3-n4m3=p4ssW0rd()'],
				error: true,
			},
			{
				description: 'getAllTagged _s0m3-n4m3=p4ssW0rd and call as function (for providers and factories should resolve them)',
				selector: ['build:tagged@_s0m3-n4m3=p4ssW0rd[]()'],
				expected: [['3', '4']],
			},
			{
				description: 'getTagged named=_with-Name0 and call as function (for providers and factories should resolve them)',
				selector: ['build:tagged@named=_with-Name0()'],
				error: true,
			},
			{
				description: 'getAllTagged named=_with-Name0 and call as function (for providers and factories should resolve them)',
				selector: ['build:tagged@named=_with-Name0[]()'],
				expected: [['1', '2']],
			},
			{
				description: 'getting multiple dependencies',
				selector: [
					'multiple:_const-A0[]',
					'multiple:_Creator-0@()',
					'multiple:_Creator-0@Target-diff_01[]()',
				],
				expected: [
					['A', 'B', 'E', 'F', 'G'],
					'C',
					['I'],
				],
			},
		].forEach(({ selector, expected = [], description, error = false }) => {
			if (error) {
				it(`should throw error ['${selector.join(`', '`)}'] - ${description}`, () => {
					return expectAsync(getDependencies(
						container,
						selector,
					)).toBeRejected();
				});
			} else {
				it(`should correctly inject ['${selector.join(`', '`)}'] - ${description}`, async () => {
					const result = await getDependencies(
						container,
						selector,
					);

					expect(result).toEqual(expected);
				});
			}
		});
	});
});
