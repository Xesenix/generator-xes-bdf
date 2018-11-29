import { interfaces } from 'inversify-vanillajs-helpers';
import { Store } from 'redux';

import { ICreateSetAction } from '../interfaces';

export interface IUIActions {
	setMuted: (value: boolean) => void;
	setMusicMuted: (value: boolean) => void;
	setEffectsMuted: (value: boolean) => void;
	setPaused: (value: boolean) => void;
	setVolume: (value: number) => void;
	setEffectsVolume: (value: number) => void;
	setMusicVolume: (value: number) => void;
	setTheme: (value: string) => void;
	setFullscreen: (value: boolean) => void;
}

export type IUIActionsProvider = () => Promise<IUIActions>;

export function UIActionsProvider(context: interfaces.Context) {
	const console: Console = context.container.get<Console>('debug:console');
	console.debug('UIActionsProvider');

	return () =>
		context.container
			.get<Store<any, any>>('data-store:provider')()
			.then((store: Store<any, any>) => {
				if (!context.container.isBound('ui:actions')) {
					const createSetMutedAction = context.container.get<ICreateSetAction<boolean>>('data-store:action:create:set-muted');
					const createSetMusicMutedAction = context.container.get<ICreateSetAction<boolean>>('data-store:action:create:set-music-muted');
					const createSetEffectsMutedAction = context.container.get<ICreateSetAction<boolean>>('data-store:action:create:set-effects-muted');
					const createSetPausedAction = context.container.get<ICreateSetAction<boolean>>('data-store:action:create:set-paused');
					const createSetVolumeAction = context.container.get<ICreateSetAction<number>>('data-store:action:create:set-volume');
					const createSetEffectsVolumeAction = context.container.get<ICreateSetAction<number>>('data-store:action:create:set-effects-volume');
					const createSetMusicVolumeAction = context.container.get<ICreateSetAction<number>>('data-store:action:create:set-music-volume');
					const createSetThemeAction = context.container.get<ICreateSetAction<string>>('data-store:action:create:set-theme');
					const createSetFullscreenAction = context.container.get<ICreateSetAction<boolean>>('data-store:action:create:set-fullscreen');

					context.container.bind<IUIActions>('ui:actions').toConstantValue({
						setMuted: (value: boolean) => store.dispatch(createSetMutedAction(value)),
						setMusicMuted: (value: boolean) => store.dispatch(createSetMusicMutedAction(value)),
						setEffectsMuted: (value: boolean) => store.dispatch(createSetEffectsMutedAction(value)),
						setPaused: (value: boolean) => store.dispatch(createSetPausedAction(value)),
						setVolume: (value: number) => store.dispatch(createSetVolumeAction(value)),
						setEffectsVolume: (value: number) => store.dispatch(createSetEffectsVolumeAction(value)),
						setMusicVolume: (value: number) => store.dispatch(createSetMusicVolumeAction(value)),
						setTheme: (value: string) => store.dispatch(createSetThemeAction(value)),
						setFullscreen: (value: boolean) => store.dispatch(createSetFullscreenAction(value)),
					});
				}

				return context.container.get<IUIActions>('ui:actions');
			});
}
