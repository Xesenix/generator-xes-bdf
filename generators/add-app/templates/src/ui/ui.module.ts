import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Reducer } from 'redux';

import { DIContext } from 'lib/di';
import { IApplication, ICreateSetAction, IEventEmitter } from 'lib/interfaces';
import BaseUIModule from 'lib/ui/ui.module';

import { createSetDrawerOpenAction } from './actions';
import { reducer } from './reducers';
import { UIBootProvider } from './ui-boot.provider';

/**
 * Connect application fullscreen state with datastore.
 */
export default class UIModule extends BaseUIModule {
	public static register(app: IApplication) {
		// call base ui module
		BaseUIModule.register(app);

		// add additional bootstrap logic needed to bootstrap extended ui module
		app.bind('boot').toProvider(UIBootProvider);

		// setup react render
		app.get<IEventEmitter>('event-manager').on('app:boot', ({ App }) => {
			const container = app.get<HTMLElement>('ui:root');
			console.debug('UIModule:initialize');
			<% if (useReact) { %>ReactDOM.render(
				React.createElement(
					DIContext.Provider,
					{ value: app },
					React.createElement(App),
				),
				container,
			);<% } else { %>App(app);<% } %>
		});

		// redux action creators
		app.bind<ICreateSetAction<boolean>>('data-store:action:create:set-drawer-open').toConstantValue(createSetDrawerOpenAction);

		// add data store keys that should be persisted between page refresh
		app.bind<string>('data-store:persist:state').toConstantValue('compactMode');

		// add reducer from this module
		app.bind<Reducer<any, any>>('data-store:reducers').toConstantValue(reducer);
	}
}
