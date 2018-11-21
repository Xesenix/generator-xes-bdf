import { Store } from 'redux';

import { IDataStoreProvider } from 'lib/data-store';
import { IApplication, ICreateSetAction } from 'lib/interfaces';

import { isFullScreen, onFullScreenChange, setFullscreen } from './fullscreen';

/**
 * Connect application fullscreen state with datastore.
 */
export class FullScreenModule {
	public static register(app: IApplication) {
		app.bind<FullScreenModule>('fullscreen:module').toConstantValue(new FullScreenModule(app));
	}

	constructor(
		// prettier-ignore
		private app: IApplication,
	) {}

	public boot = () => {
		return this.app
			.get<IDataStoreProvider<any, any>>('data-store:provider')()
			.then((store: Store) => {
				const createSetFullscreenAction = this.app.get<ICreateSetAction<boolean>>('data-store:action:create:set-fullscreen');

				// synchronize data store with fullscreen state
				onFullScreenChange(() => {
					const { fullscreen } = store.getState();
					const currentFullScreenState: boolean = isFullScreen();

					if (fullscreen !== currentFullScreenState) {
						store.dispatch(createSetFullscreenAction(currentFullScreenState));
					}
				});

				// synchronize fullscreen state with data store
				store.subscribe(() => {
					const { fullscreen } = store.getState();
					const currentFullScreenState: boolean = isFullScreen();

					if (fullscreen !== currentFullScreenState) {
						setFullscreen(fullscreen);
					}
				});
			});
	}
}
