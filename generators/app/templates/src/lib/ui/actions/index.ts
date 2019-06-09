import { IValueAction } from 'lib/interfaces';

export const SET_MUTED = 'UI_SET_MUTED';

export const createSetMutedAction = (value: boolean): IValueAction<boolean> => ({
	type: SET_MUTED,
	value,
});

export const SET_MUSIC_MUTED = 'UI_SET_MUSIC_MUTED';
export const createSetMusicMutedAction = (value: boolean): IValueAction<boolean> => ({
	type: SET_MUSIC_MUTED,
	value,
});

export const SET_EFFECTS_MUTED = 'UI_SET_EFFECTS_MUTED';
export const createSetEffectsMutedAction = (value: boolean): IValueAction<boolean> => ({
	type: SET_EFFECTS_MUTED,
	value,
});

export const SET_PAUSED = 'UI_SET_PAUSED';

export const createSetPausedAction = (value: boolean): IValueAction<boolean> => ({
	type: SET_PAUSED,
	value,
});

export const SET_VOLUME = 'UI_SET_VOLUME';

export const createSetVolumeAction = (value: number): IValueAction<number> => ({
	type: SET_VOLUME,
	value,
});

export const SET_EFFECTS_VOLUME = 'UI_SET_EFFECTS_VOLUME';
export const createSetEffectsVolumeAction = (value: number): IValueAction<number> => ({
	type: SET_EFFECTS_VOLUME,
	value,
});

export const SET_MUSIC_VOLUME = 'UI_SET_MUSIC_VOLUME';
export const createSetMusicVolumeAction = (value: number): IValueAction<number> => ({
	type: SET_MUSIC_VOLUME,
	value,
});
