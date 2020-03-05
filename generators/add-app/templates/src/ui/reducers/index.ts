import { INITIALIZE } from 'lib/data-store';
import { IValueAction } from 'lib/interfaces';
import { defaultUIState as baseUIState } from 'lib/ui';

import { SET_SET_DRAWER_OPEN } from '../actions';
import { IUIState } from '../interfaces';

export const defaultUIState: IUIState = {
	...baseUIState,
	drawerOpen: false,
};

export function reducer<S extends IUIState | undefined, A extends IValueAction<any>>(state: S = defaultUIState as S, action: A): S {
	switch (action.type) {
		case INITIALIZE: {
			return { ...defaultUIState, ...state };
		}
		case SET_SET_DRAWER_OPEN: {
			const { value } = action as IValueAction<boolean>;
			return {
				...(state as any),
				drawerOpen: value,
			};
		}
	}
	return state;
}
