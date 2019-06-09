import { INITIALIZE } from 'lib/data-store';
import { IValueAction } from 'lib/interfaces';

import { IFullscreenState } from '../fullscreen.interfaces';

import {
	// prettier-ignore
	SET_FULLSCREEN,
} from '../actions';

export const defaultFullscreenState: IFullscreenState = {
	fullscreen: false,
};

export function reducer<S extends IFullscreenState | undefined, A extends IValueAction<any>>(state: S = defaultFullscreenState as S, action: A): S {
	switch (action.type) {
		case INITIALIZE: {
			return { ...defaultFullscreenState, ...state };
		}
		case SET_FULLSCREEN: {
			const { value } = action as IValueAction<boolean>;
			return {
				...(state as any),
				fullscreen: value,
			};
		}
	}
	return state;
}
