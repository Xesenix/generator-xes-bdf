import { inject } from 'lib/di';

import { IUser } from './interfaces';

@inject([
	{ type: 'user:actions', named: 'setUser' },
	{ type: 'user:actions', named: 'setAuthenticationError' },
	'authenticate',
])
export class SessionService {
	constructor(
		private setUser: (user: IUser) => void,
		private setAuthenticationError: (error: any) => void,
		private authenticator: (credentials: { login: string }) => Promise<any>,
	) {
	}

	public async authenticate(credentials: any) {
		if (!!credentials) {
			this.authenticator(credentials).then((u) => {
				console.log('AUTHENTICATION', u, credentials);
				this.setUser({ id: 'some-user', roles: ['player']});
			}, (error) => {
				this.setAuthenticationError(error);
			});
		}
	}
}
