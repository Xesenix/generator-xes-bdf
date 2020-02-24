import { IValueAction } from 'lib/interfaces';

import { ThemesNames } from '../interfaces';

export const SET_THEME = 'UI_SET_THEME';

export const createSetThemeAction = (value: ThemesNames): IValueAction<ThemesNames> => ({
	type: SET_THEME,
	value,
});
