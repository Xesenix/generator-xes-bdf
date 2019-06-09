import { interfaces } from 'inversify';
import { Store } from 'redux';

import { ICreateSetAction } from 'lib/interfaces';

export function UIBootProvider({ container }: interfaces.Context) {
	const console: Console = container.get<Console>('debug:console');
	console.debug('UIBootProvider');

	return () => container.get<() => Promise<Store<any, any>>>('data-store:provider')()
		.then((store: Store<any, any>) => {
			console.debug('UIBootProvider:boot');
			const createSetCompactModeAction = container.get<ICreateSetAction<boolean>>('data-store:action:create:set-compact-mode');
			container.bind('ui:actions').toConstantValue((value: boolean) => store.dispatch(createSetCompactModeAction(value))).whenTargetNamed('setCompactMode');


			const createSetDrawerOpenAction = container.get<ICreateSetAction<boolean>>('data-store:action:create:set-drawer-open');
			container.bind('ui:actions').toConstantValue((value: boolean) => store.dispatch(createSetDrawerOpenAction(value))).whenTargetNamed('setDrawerOpen');
		});
}
