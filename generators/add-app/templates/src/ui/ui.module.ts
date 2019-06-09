import { Reducer } from 'redux';

import { IApplication, ICreateSetAction } from 'lib/interfaces';
import { UIModule as BaseUIModule } from 'lib/ui';

import { createSetCompactModeAction, createSetDrawerOpenAction } from './actions';
import { reducer } from './reducers';
import { UIBootProvider } from './ui-boot.provider';


/**
 * Connect application fullscreen state with datastore.
 */
export class UIModule extends BaseUIModule {
	public static register(app: IApplication) {
		// call base ui module
		BaseUIModule.register(app);

		// add additional bootstrap logic needed to bootstrap extended ui module
		app.bind('boot').toProvider(UIBootProvider);

		// redux action creators
		app.bind<ICreateSetAction<boolean>>('data-store:action:create:set-compact-mode').toConstantValue(createSetCompactModeAction);
		app.bind<ICreateSetAction<boolean>>('data-store:action:create:set-drawer-open').toConstantValue(createSetDrawerOpenAction);

		// add data store keys that should be persisted between page refresh
		app.bind<string>('data-store:persist:state').toConstantValue('compactMode');

		// add reducer from this module
		app.bind<Reducer<any, any>>('data-store:reducers').toConstantValue(reducer);
	}
}
