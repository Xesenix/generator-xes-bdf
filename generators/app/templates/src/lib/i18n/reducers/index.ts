import { INITIALIZE } from 'lib/data-store';
import { IValueAction, LanguageType } from 'lib/interfaces';

import { I18nAction, II18nState } from '../i18n.interfaces';

import {
	// prettier-ignore
	ISetLanguageReadyAction,
	SET_CURRENT_LANGUAGE,
	SET_LANGUAGE_READY,
} from '../actions';

export const defaultI18nState: II18nState = {
	languages: { en: { ready: false } },
	language: 'en',
};

export function reducer<S extends II18nState | undefined, A extends I18nAction>(state: S = defaultI18nState as S, action: A): S {
	switch (action.type) {
		case INITIALIZE: {
			return { ...defaultI18nState, ...state };
		}
		case SET_CURRENT_LANGUAGE: {
			const { value } = action as IValueAction<LanguageType>;
			const { languages = { [value]: { ready: false } } } = state as II18nState;
			const lang = languages[value] || { ready: false };
			state = {
				...(state as any),
				language: value,
				languages: {
					...languages,
					[value]: {
						ready: lang.ready,
					},
				},
			};
			break;
		}
		case SET_LANGUAGE_READY: {
			const { locale, value } = action as ISetLanguageReadyAction;
			state.languages = {
				...state.languages,
				[locale]: {
					ready: value,
				},
			};
			break;
		}
	}
	return state;
}
