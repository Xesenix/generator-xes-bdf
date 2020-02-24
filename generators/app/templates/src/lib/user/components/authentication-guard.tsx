import * as React from 'react';
import { hot } from 'react-hot-loader';

import { connectToInjector } from 'lib/di';

import { IUserState } from '../interfaces';

/** Component public properties required to be provided by parent component. */
export interface IAuthenticationGuardExternalProps {
	allowed?: React.ReactElement;
	disallowed?: React.ReactElement;
}

/** Internal component properties include properties injected via dependency injection. */
interface IAuthenticationGuardInternalProps {
	bindToStore: (keys: (keyof IUserState)[]) => IUserState;
}

type IAuthenticationGuardProps = IAuthenticationGuardExternalProps & IAuthenticationGuardInternalProps;

const diDecorator = connectToInjector<IAuthenticationGuardExternalProps, IAuthenticationGuardInternalProps>({
	bindToStore: {
		dependencies: ['data-store:bind'],
	},
});

function AuthenticationGuard(props: IAuthenticationGuardProps): any {
	const {
		// prettier-ignore
		allowed = null,
		disallowed = null,
		bindToStore,
	} = props;
	const { user } = bindToStore(['user']);

	return !!user && !!user.id ? allowed : disallowed;
}

export default hot(module)(diDecorator(AuthenticationGuard));
