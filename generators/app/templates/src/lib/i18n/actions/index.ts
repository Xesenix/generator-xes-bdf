import { IValueAction, LanguageType } from 'lib/interfaces';

export const SET_CURRENT_LANGUAGE = 'I18N_SET_CURRENT_LANGUAGE';

/**
 * Create action for selecting current application locales.
 *
 * @param value selected locale
 */
export const createSetCurrentLanguageAction = (
	// prettier-ignore
	value: LanguageType,
): IValueAction<LanguageType> => ({
	type: SET_CURRENT_LANGUAGE,
	value,
});

export const SET_LANGUAGE_READY = 'I18N_SET_LANGUAGE_READY';
export interface ISetLanguageReadyAction extends IValueAction<boolean> {
	// prettier-ignore
	locale: LanguageType;
}

/**
 * Create action for marking load state of requested locale.
 *
 * @param locale loaded locale
 * @param value state
 */
export type ICreateSetLanguageReadyAction = (
	// prettier-ignore
	locale: LanguageType,
	value: boolean,
) => ISetLanguageReadyAction;

/**
 * Create action for marking load state of requested locale.
 *
 * @param locale loaded locale
 * @param value state
 */
export const createLanguageReadyAction: ICreateSetLanguageReadyAction = (
	// prettier-ignore
	locale: LanguageType,
	value: boolean,
): ISetLanguageReadyAction => ({
	type: SET_LANGUAGE_READY,
	locale,
	value,
});
