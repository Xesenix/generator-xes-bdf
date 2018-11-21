import { IValueAction } from 'lib/interfaces';

export type LanguageType = 'en' | 'pl';

export const SET_LANGUAGE = 'I18N_SET_LANGUAGE';

/**
 * Create action for selecting current application locales.
 *
 * @param value selected locale
 */
export const createSetLanguageAction = (value: LanguageType): IValueAction<LanguageType> => ({
	type: SET_LANGUAGE,
	value,
});

export const SET_LANGUAGE_READY = 'I18N_SET_LANGUAGE_READY';
export interface ISetLanguageReadyAction extends IValueAction<boolean> {
	locale: LanguageType;
}

/**
 * Create action for marking load state of requested locale.
 *
 * @param locale loaded locale
 * @param value state
 */
export type ICreateSetLanguageReadyAction = (locale: LanguageType, value: boolean) => ISetLanguageReadyAction;

/**
 * Create action for marking load state of requested locale.
 *
 * @param locale loaded locale
 * @param value state
 */
export const createLanguageReadyAction: ICreateSetLanguageReadyAction = (locale: LanguageType, value: boolean): ISetLanguageReadyAction => ({
	type: SET_LANGUAGE_READY,
	locale,
	value,
});
