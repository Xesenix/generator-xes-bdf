import { interfaces } from 'inversify';

import { IApplication, IEventEmitter } from 'lib/interfaces';


function KongregateAPIProvider({ container }: interfaces.Context) {
	const console: Console = container.get<Console>('debug:console');
	console.debug('KongregateAPIProvider');

	return () => new Promise((resolve, reject) => {
		if (container.isBound('kongregate:api')) {
			return resolve(container.get('kongregate:api'));
		}
		const window: any = container.get('window');
		window.kongregateAPI.loadAPI(() => {
			const api = window.kongregateAPI.getAPI();
			container.bind('kongregate:api').toConstantValue(api);
			resolve(api);
		});
	});
}

function KongregateBootProvider({ container }: interfaces.Context) {
	const console: Console = container.get<Console>('debug:console');
	const em: IEventEmitter = container.get<IEventEmitter>('event-manager');
	console.debug('KongregateBootProvider');

	return () => {
		em.on('app:boot', () => {
			Promise.all([
				container.get<any>('kongregate:api:provider')(),
				container.getTagged<(value: any) => void>('user:actions', 'named', 'setUser'),
			])
			.then(([api, setUser]) => {
				// listen to kongregate shell authentication
				api.services.addEventListener('login', () => {
					setUser({
						user: api.services.getUsername(),
						token: api.services.getGameAuthToken(),
					});
				});
			});
		});

		return Promise.resolve();
	};
}

/**
 */
export default class KongregateModule {
	public static register(app: IApplication) {
		const console: Console = app.get<Console>('debug:console');
		console.debug('KongregateModule');

		app.bind('boot').toProvider(KongregateBootProvider);

		app.bind('kongregate:api:provider').toProvider(KongregateAPIProvider);

		app.bind('authenticate').toFunction((request: any) => {
			if (request.method !== 'kongregate') {
				return Promise.reject(false);
			}

			return app.get<Promise<(request: any) => Promise<any>>>('kongregate:authenticate:provider')
				.then((loginWithKongregate) => loginWithKongregate({
					KongregateId: request.KongregateId,
					AuthTicket: process.env.KONGREGATE_API_KEY,
					CreateAccount: false,
				}))
				.then((result) => {
					console.log('KongregateModule:authenticated', result);
					if (result.EntityId) {
						const em = app.get<IEventEmitter>('event-manager');
						em.emit('authenticated', result);
						return result;
					}

					return Promise.reject('Authentication error');
				}, (error) => {
					console.log('KongregateModule:authenticate:error', error);
					const em = app.get<IEventEmitter>('event-manager');
					em.emit('error:authentication', error);
					return error;
				});
		});
	}
}


