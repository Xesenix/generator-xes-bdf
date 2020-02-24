import { INITIALIZE } from 'lib/data-store';
import { IValueAction } from 'lib/interfaces';

import { SET_THEME } from '../actions';
import { IThemeState } from '../interfaces';

export const defaultThemeState: IThemeState = {
	theme: 'default-theme-light',
};

export function reducer<S extends IThemeState | undefined, A extends IValueAction<any>>(state: S = defaultThemeState as S, action: A): S {
	switch (action.type) {
		case INITIALIZE: {
			return { ...defaultThemeState, ...state };
		}
		case SET_THEME: {
			const { value } = action as IValueAction<string>;
			return {
				...state,
				theme: value,
			};
		}
	}
	return state;
}
