import { ContainerModule, interfaces } from 'inversify';
import { ICreateSetAction } from 'lib/interfaces';

import {
	createSetEffectsMutedAction,
	createSetEffectsVolumeAction,
	createSetFullscreenAction,
	createSetMusicMutedAction,
	createSetMusicVolumeAction,
	createSetMutedAction,
	createSetPausedAction,
	createSetThemeAction,
	createSetVolumeAction,
} from './actions/index';
import { IUIStoreProvider, UIStoreProvider } from './store.provider';

export const UIModule = () =>
	new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
		bind<IUIStoreProvider>('ui:store').toProvider(UIStoreProvider);

		bind<ICreateSetAction<boolean>>('data-store:action:create:set-muted').toConstantValue(createSetMutedAction);
		bind<ICreateSetAction<boolean>>('data-store:action:create:set-music-muted').toConstantValue(createSetMusicMutedAction);
		bind<ICreateSetAction<boolean>>('data-store:action:create:set-effects-muted').toConstantValue(createSetEffectsMutedAction);
		bind<ICreateSetAction<boolean>>('data-store:action:create:set-paused').toConstantValue(createSetPausedAction);
		bind<ICreateSetAction<number>>('data-store:action:create:set-volume').toConstantValue(createSetVolumeAction);
		bind<ICreateSetAction<number>>('data-store:action:create:set-effects-volume').toConstantValue(createSetEffectsVolumeAction);
		bind<ICreateSetAction<number>>('data-store:action:create:set-music-volume').toConstantValue(createSetMusicVolumeAction);
		bind<ICreateSetAction<string>>('data-store:action:create:set-theme').toConstantValue(createSetThemeAction);
		bind<ICreateSetAction<boolean>>('data-store:action:create:set-fullscreen').toConstantValue(createSetFullscreenAction);
	});
