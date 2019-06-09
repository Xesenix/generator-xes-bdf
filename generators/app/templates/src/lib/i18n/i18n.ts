import HtmlDecoder from 'html-decoder';
import { memoize } from 'lodash';
import Gettext from 'node-gettext';

/**
 * We instantiate singleton translation object so any changes to it will affect all places that need translation.
 */
export const i18n = new Gettext();

/**
 * Shorter version for translations also needed for easy translations extraction.
 * This needs to be bind to translation object to take into account any changes in current locale set in it.
 */
export const __ = memoize(
	(
		// prettier-ignore
		key: string,
		variables: { [key: string]: string | number | null } = {},
		domain: string = 'messages',
	) => {
		const content = HtmlDecoder.decode(i18n.dgettext(domain, key));

		// substitute variable placeholders
		return Object.keys(variables).reduce((result, varName: string) => result.replace(`%{${varName}}`, variables[varName]), content);
	},
	(
		// prettier-ignore
		key: string,
		variables: { [key: string]: string | number | null } = {},
		domain: string = '',
	) =>
		JSON.stringify({
			key, // each key needs own cache
			domain, // different domain may have diffrent translations
			variables, // changing variable requires updating substitutions
			locale: (i18n as any).locale, // if locales change we need to refresh cache
		}),
);

/**
 * Shorter version for plural translations also needed for easy translations extraction.
 * This needs to be bind to translation object to take into account any changes in current locale set in it.
 */
export const _$ = memoize(
	(
		// prettier-ignore
		value: number,
		key: string,
		pluralKey: string,
		variables: { [key: string]: string | number | null } = {},
		domain: string = 'messages',
	) => {
		const content = HtmlDecoder.decode(i18n.dngettext(domain, key, pluralKey, value));

		// substitute variable placeholders
		return Object.keys(variables).reduce((result, varName: string) => result.replace(`%{${varName}}`, variables[varName]), content);
	},
	(
		// prettier-ignore
		value: number,
		key: string,
		pluralKey: string,
		variables: { [key: string]: string | number | null } = {},
		domain: string = '',
	) =>
		JSON.stringify({
			value, // plural decision value
			key, // each key needs own cache
			pluralKey, // each key needs own cache
			domain, // different domain may have diffrent translations
			variables, // changing variable requires updating substitutions
			locale: (i18n as any).locale, // if locales change we need to refresh cache
		}),
);
