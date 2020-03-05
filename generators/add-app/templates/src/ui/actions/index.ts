import { IValueAction } from 'lib/interfaces';

export const SET_SET_DRAWER_OPEN = 'UI_SET_DRAWER_OPEN';

export const createSetDrawerOpenAction = (value: boolean): IValueAction<boolean> => ({
	type: SET_SET_DRAWER_OPEN,
	value,
});
