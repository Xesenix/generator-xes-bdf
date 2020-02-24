import { INITIALIZE } from 'lib/data-store';
import { IValueAction } from 'lib/interfaces';

import { IUser, IUserState } from '../interfaces';

import {
	// prettier-ignore
	SET_AUTHENTICATION_ERROR,
	SET_USER,
} from '../actions';

export const defaultUIState: IUserState = {
	user: { roles: ['guest'] },
	authenticationError: null,
};

export function reducer<S extends IUserState | undefined, A extends IValueAction<any>>(state: S = defaultUIState as S, action: A): S {
	switch (action.type) {
		case INITIALIZE: {
			return { ...defaultUIState, ...state };
		}
		case SET_USER: {
			const { value } = action as IValueAction<IUser>;
			return {
				...(state as any),
				user: value,
				authenticationError: null,
			};
		}
		case SET_AUTHENTICATION_ERROR: {
			const { value } = action as IValueAction<any>;
			return {
				...(state as any),
				authenticationError: value,
			};
		}
	}
	return state;
}
