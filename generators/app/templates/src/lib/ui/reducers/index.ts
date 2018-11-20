import { IValueAction } from 'lib/interfaces';

import {
	SET_EFFECTS_MUTED,
	SET_EFFECTS_VOLUME,
	SET_FULLSCREEN,
	SET_MUSIC_MUTED,
	SET_MUSIC_VOLUME,
	SET_MUTED,
	SET_PAUSED,
	SET_THEME,
	SET_VOLUME,
} from '../actions';

export interface IUIState {
	mute: boolean;
	musicMuted: boolean;
	effectsMuted: boolean;
	paused: boolean;
	effectsVolume: number;
	musicVolume: number;
	volume: number;
	theme: 'dark' | 'light';
	fullscreen: boolean;
}

export const defaultUIState: IUIState = {
	mute: false,
	musicMuted: false,
	effectsMuted: false,
	paused: false,
	effectsVolume: 1.0,
	volume: 0.1,
	musicVolume: 1.0,
	theme: 'light',
	fullscreen: false,
};

export function uiReducer<S extends IUIState | undefined, A extends IValueAction<any>>(state: S = defaultUIState as S, action: A): S {
	switch (action.type) {
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
		case SET_THEME: {
			const { value } = action as IValueAction<string>;
			return {
				...(state as any),
				theme: value,
			};
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
