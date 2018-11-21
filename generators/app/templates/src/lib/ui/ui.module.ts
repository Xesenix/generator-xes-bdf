import { IApplication, ICreateSetAction } from 'lib/interfaces';

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

/**
 * Connect application fullscreen state with datastore.
 */
export class UIModule {
	public static register(app: IApplication) {
		app.bind<UIModule>('ui:module').toConstantValue(new UIModule(app));

		app.bind<IUIStoreProvider>('ui:store').toProvider(UIStoreProvider);

		app.bind<ICreateSetAction<boolean>>('data-store:action:create:set-muted').toConstantValue(createSetMutedAction);
		app.bind<ICreateSetAction<boolean>>('data-store:action:create:set-music-muted').toConstantValue(createSetMusicMutedAction);
		app.bind<ICreateSetAction<boolean>>('data-store:action:create:set-effects-muted').toConstantValue(createSetEffectsMutedAction);
		app.bind<ICreateSetAction<boolean>>('data-store:action:create:set-paused').toConstantValue(createSetPausedAction);
		app.bind<ICreateSetAction<number>>('data-store:action:create:set-volume').toConstantValue(createSetVolumeAction);
		app.bind<ICreateSetAction<number>>('data-store:action:create:set-effects-volume').toConstantValue(createSetEffectsVolumeAction);
		app.bind<ICreateSetAction<number>>('data-store:action:create:set-music-volume').toConstantValue(createSetMusicVolumeAction);
		app.bind<ICreateSetAction<string>>('data-store:action:create:set-theme').toConstantValue(createSetThemeAction);
		app.bind<ICreateSetAction<boolean>>('data-store:action:create:set-fullscreen').toConstantValue(createSetFullscreenAction);
	}

	constructor(
		// prettier-ignore
		private app: IApplication,
	) {}

	public boot = () => {
		return this.app.get<IUIStoreProvider>('ui:store')();
	}
}
