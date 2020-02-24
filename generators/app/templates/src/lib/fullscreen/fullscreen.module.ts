import { Reducer } from 'redux';

import { IApplication, ICreateSetAction } from 'lib/interfaces';

import { createSetFullscreenAction } from './actions';
import { FullscreenBootProvider } from './fullscreen-boot.provider';
import { reducer } from './reducers';
/**
 * Connect application fullscreen state with datastore.
 */
export default class FullScreenModule {
	public static register(app: IApplication): void {
		// define logic needed to bootstrap module
		app.bind('boot').toProvider(FullscreenBootProvider);

		// redux action creators
		app.bind<ICreateSetAction<boolean>>('data-store:action:create:set-fullscreen').toConstantValue(createSetFullscreenAction);

		if (!app.isBound('ui:fullscreen-root')) {
			const document = app.get<Document>('document');
			app.bind<HTMLElement>('ui:fullscreen-root').toConstantValue(document.querySelector('body') as HTMLElement);
		}

		// add reducer from this module
		app.bind<Reducer<any, any>>('data-store:reducers').toConstantValue(reducer);
	}
}
