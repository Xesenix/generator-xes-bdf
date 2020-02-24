import { INITIALIZE } from 'lib/data-store';
import { IValueAction } from 'lib/interfaces';

import { IUIState } from '../interfaces';

import {
	// prettier-ignore
	SET_EFFECTS_MUTED,
	SET_EFFECTS_VOLUME,
	SET_MUSIC_MUTED,
	SET_MUSIC_VOLUME,
	SET_MUTED,
	SET_PAUSED,
	SET_VOLUME,
} from '../actions';

export const defaultUIState: IUIState = {
	mute: false,
	musicMuted: false,
	effectsMuted: false,
	paused: false,
	effectsVolume: 1.0,
	volume: 0.5,
	musicVolume: 1.0,
};

export function reducer<S extends IUIState | undefined, A extends IValueAction<any>>(state: S = defaultUIState as S, action: A): S {
	switch (action.type) {
		case INITIALIZE: {
			return { ...defaultUIState, ...state };
		}
		case SET_MUTED: {
			const { value } = action as IValueAction<boolean>;
			return {
				...(state as any),
				mute: value,
			};
		}
		case SET_MUSIC_MUTED: {
			const { value } = action as IValueAction<boolean>;
			return {
				...(state as any),
				musicMuted: value,
			};
		}
		case SET_EFFECTS_MUTED: {
			const { value } = action as IValueAction<boolean>;
			return {
				...(state as any),
				effectsMuted: value,
			};
		}
		case SET_PAUSED: {
			const { value } = action as IValueAction<boolean>;
			return {
				...(state as any),
				paused: value,
			};
		}
		case SET_VOLUME: {
			const { value } = action as IValueAction<number>;
			return {
				...(state as any),
				volume: value,
			};
		}
		case SET_MUSIC_VOLUME: {
			const { value } = action as IValueAction<number>;
			return {
				...(state as any),
				musicVolume: value,
			};
		}
		case SET_EFFECTS_VOLUME: {
			const { value } = action as IValueAction<number>;
			return {
				...(state as any),
				effectsVolume: value,
			};
		}
	}
	return state;
}
