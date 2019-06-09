import { _$, __, i18n } from './i18n';

describe('localize', () => {
	describe('i18n', () => {
		describe('setLocale', () => {
			it('should switch current locale', () => {
				const locale = 'xyz';
				i18n.setLocale(locale);
				expect((i18n as any).locale).toEqual(locale);
			});
		});
	});

	describe('__', () => {
		it('should translate provided keys', () => {
			i18n.addTranslations('pl', 'messages', {
				charset: 'utf-8',
				headers: {
					language: 'pl_PL',
					'plural-forms': 'nplurals=3; plural=(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);',
				},
				translations: {
					'': {
						abc: { msgid: 'abc', msgstr: ['xyz'] },
						'ABC %{placeholder}': { msgid: 'ABC %{placeholder}', msgstr: ['%{placeholder}QWERTY'] },
					},
				},
			});
			i18n.setLocale('pl');
			expect(__('abc')).toEqual('xyz');
			expect(__('ABC %{placeholder}', { placeholder: 'ups' })).toEqual('upsQWERTY');
			expect(__('boom')).toEqual('boom');
		});
	});

	describe('_$', () => {
		it('should translate provided keys', () => {
			i18n.addTranslations('pl', 'messages', {
				charset: 'utf-8',
				headers: {
					language: 'pl_PL',
					'plural-forms': 'nplurals=3; plural=(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);',
				},
				translations: {
					'': {
						'abc one time': { msgid: 'abc one time', msgstr: ['xyz jeden raz', 'xyz %{count} razy', 'xyz %{count} razów'] },
						ABC: { msgid: 'ABC', msgstr: ['QWERTY'] },
					},
				},
			});
			i18n.setLocale('pl');
			expect(_$(1, 'abc one time', 'abc %{count} times')).toEqual('xyz jeden raz');
			expect(_$(2, 'abc one time', 'abc %{count} times', { count: 2 })).toEqual('xyz 2 razy');
			expect(_$(5, 'abc one time', 'abc %{count} times', { count: 5 })).toEqual('xyz 5 razów');
		});
	});
});
