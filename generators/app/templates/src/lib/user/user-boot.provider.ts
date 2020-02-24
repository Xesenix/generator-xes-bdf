import { interfaces } from 'inversify';
import { Store } from 'redux';

import { ICreateSetAction } from '../interfaces';

export function UserBootProvider({ container }: interfaces.Context) {
	const console: Console = container.get<Console>('debug:console');
	console.debug('UserBootProvider');

	return () => container.get<() => Promise<Store<any, any>>>('data-store:provider')()
		.then((store: Store<any, any>) => {
			console.debug('UserBootProvider:boot');

			const createSetUserAction = container.get<ICreateSetAction<boolean>>('user:action:create:set-user');
			container.bind('user:actions')
				.toConstantValue((value: boolean) => store.dispatch(createSetUserAction(value)))
				.whenTargetNamed('setUser');

			const createSetAuthenticationErrorAction = container.get<ICreateSetAction<boolean>>('user:action:create:set-authentication-error');
			container.bind('user:actions')
				.toConstantValue((value: boolean) => store.dispatch(createSetAuthenticationErrorAction(value)))
				.whenTargetNamed('setAuthenticationError');
		});
}
