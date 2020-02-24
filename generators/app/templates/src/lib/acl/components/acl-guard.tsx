import * as React from 'react';
import { hot } from 'react-hot-loader';

import { connectToInjector } from 'lib/di';

import { IACLGuard, IUser } from '../interfaces';

/** Component public properties required to be provided by parent component. */
export interface IAclGuardExternalProps {
	allowed?: React.ReactElement;
	disallowed?: React.ReactElement;
	resource: string;
	permissions: string;
}

/** Internal component properties include properties injected via dependency injection. */
interface IAclGuardInternalProps {
	aclGuard: IACLGuard;
	bindToStore: (keys: (keyof IAclGuardState)[]) => IAclGuardState;
}

/** Internal component state. */
interface IAclGuardState {
	user: IUser;
}

type IAclGuardProps = IAclGuardExternalProps & IAclGuardInternalProps;

const diDecorator = connectToInjector<IAclGuardExternalProps, IAclGuardInternalProps>({
	aclGuard: {
		dependencies: ['acl'],
	},
	bindToStore: {
		dependencies: ['data-store:bind'],
	},
});

function AclGuard(props: IAclGuardProps): any {
	const {
		// prettier-ignore
		aclGuard,
		resource,
		permissions,
		allowed = null,
		disallowed = null,
		bindToStore,
	} = props;
	const { user } = bindToStore(['user']);
	const [ isAllowed, setAllowed ] = React.useState<boolean | null>(null);

	React.useEffect(() => {
		let connected = true;

		aclGuard.isAllowed(user, resource, permissions)
			.then((result: boolean) => {
				if (connected) {
					setAllowed(result);
				}
			});

		return () => {
			connected = false;
		};
	}, [user, resource, aclGuard, setAllowed]);

	return isAllowed === true
		? allowed
		: isAllowed === false
			? disallowed
			: null;
}

export default hot(module)(diDecorator(AclGuard));
