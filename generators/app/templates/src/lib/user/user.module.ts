import { Reducer } from 'redux';

import { IApplication, ICreateSetAction } from 'lib/interfaces';

import { createSetAuthenticationErrorAction, createSetUserAction } from './actions';
import { IUser } from './interfaces';
import { reducer } from './reducers';
import { SessionService } from './session.service';
import { UserBootProvider } from './user-boot.provider';

export default class UserModule {
	public static register(app: IApplication) {
		// define logic needed to bootstrap module
		app.bind('boot').toProvider(UserBootProvider);

		// redux action creators
		app.bind<ICreateSetAction<IUser>>('user:action:create:set-user').toConstantValue(createSetUserAction);
		app.bind<ICreateSetAction<any>>('user:action:create:set-authentication-error').toConstantValue(createSetAuthenticationErrorAction);

		// TODO: research what we can persist from user state if anything at all
		// // add data store keys that should be persisted between page refresh
		// app.bind<string>('data-store:persist:state').toConstantValue('user');

		// add reducer from this module
		app.bind<Reducer<any, any>>('data-store:reducers').toConstantValue(reducer);

		// services
		app.bind<SessionService>('user:session').to(SessionService);
	}
}
