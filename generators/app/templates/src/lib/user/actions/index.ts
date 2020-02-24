import { IValueAction } from 'lib/interfaces';

import { IUser } from '../interfaces';

export const SET_USER = 'UI_SET_USER';

export const createSetUserAction = (value: IUser): IValueAction<IUser> => ({
	type: SET_USER,
	value,
});

export const SET_AUTHENTICATION_ERROR = 'UI_SET_AUTHENTICATION_ERROR';

export const createSetAuthenticationErrorAction = (value: IUser): IValueAction<IUser> => ({
	type: SET_AUTHENTICATION_ERROR,
	value,
});
