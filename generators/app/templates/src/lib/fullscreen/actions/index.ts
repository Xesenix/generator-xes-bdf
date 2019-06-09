import { IValueAction } from 'lib/interfaces';

export const SET_FULLSCREEN = 'UI_SET_FULLSCREEN';

export const createSetFullscreenAction = (value: boolean): IValueAction<boolean> => ({
	type: SET_FULLSCREEN,
	value,
});
