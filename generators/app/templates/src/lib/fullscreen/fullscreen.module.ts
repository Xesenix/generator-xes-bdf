import { Reducer } from 'redux';

import { IApplication, ICreateSetAction } from 'lib/interfaces';

import { createSetFullscreenAction } from './actions';
import { FullscreenBootProvider } from './fullscreen-boot.provider';
import { reducer } from './reducers';

/**
 * Connect application fullscreen state with datastore.
 */
export class FullScreenModule {
	public static register(app: IApplication, root: HTMLElement): void {
		// define logic needed to bootstrap module
		app.bind('boot').toProvider(FullscreenBootProvider);

		// redux action creators
		app.bind<ICreateSetAction<boolean>>('data-store:action:create:set-fullscreen').toConstantValue(createSetFullscreenAction);

		app.bind<HTMLElement>('ui:fullscreen-root').toConstantValue(root);

		// add reducer from this module
		app.bind<Reducer<any, any>>('data-store:reducers').toConstantValue(reducer);
	}
}
