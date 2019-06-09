import { IValueAction } from 'lib/interfaces';

export const SET_COMPACT_MODE = 'UI_SET_COMPACT_MODE';

export const createSetCompactModeAction = (value: boolean): IValueAction<boolean> => ({
	type: SET_COMPACT_MODE,
	value,
});

export const SET_SET_DRAWER_OPEN = 'UI_SET_DRAWER_OPEN';

export const createSetDrawerOpenAction = (value: boolean): IValueAction<boolean> => ({
	type: SET_SET_DRAWER_OPEN,
	value,
});
