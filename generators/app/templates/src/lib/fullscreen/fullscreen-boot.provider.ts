import { interfaces } from 'inversify';
import { Store } from 'redux';

import { ICreateSetAction } from 'lib/interfaces';

// TODO: inject via DI
import { isFullScreen, onFullScreenChange, setFullscreen } from './fullscreen';

export function FullscreenBootProvider({ container }: interfaces.Context) {
	const console: Console = container.get<Console>('debug:console');
	console.debug('FullscreenBootProvider');

	return () => container.get<() => Promise<Store<any, any>>>('data-store:provider')()
		.then((store: Store<any, any>) => {
			console.debug('FullscreenBootProvider:boot');

			const createSetFullscreenAction = container.get<ICreateSetAction<boolean>>('data-store:action:create:set-fullscreen');
			const setFullScreenAction = (value: boolean) => store.dispatch(createSetFullscreenAction(value));
			container.bind('ui:actions')
				.toConstantValue(setFullScreenAction)
				.whenTargetNamed('setFullscreen');

			// synchronize data store with fullscreen state
			onFullScreenChange(() => {
				const { fullscreen } = store.getState();
				const currentFullScreenState: boolean = isFullScreen();

				if (fullscreen !== currentFullScreenState) {
					setFullScreenAction(currentFullScreenState);
				}
			});

			// initial sync
			// setFullScreenAction(false);

			// synchronize fullscreen state with data store
			store.subscribe(() => {
				const { fullscreen } = store.getState();
				const currentFullScreenState: boolean = isFullScreen();

				if (fullscreen !== currentFullScreenState) {
					setFullscreen(fullscreen, container.get<HTMLElement>('ui:fullscreen-root'));
				}
			});
		});
}
