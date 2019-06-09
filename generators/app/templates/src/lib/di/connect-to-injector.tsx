import hoistNonReactStatic from 'hoist-non-react-statics';
import * as React from 'react';

import { useInjector } from './use-injector';

const componentNameRegexp = /function ([a-zA-Z0-9_]+)\(/;

/**
 * Map dependencies from DI container into component properties.
 *
 * @export
 * @template T interface for properties injected via component properties
 * @template I interface for properties injected via dependency injection
 * @template E interface exposed for properties injected via component properties
 * @param Consumer component into which we want to inject dependencies from dependency container
 * @param select map dependencies from container to properties names injected into decorated component properties
 * @returns component with injected values from DI container
 */
export function connectToInjector<T, I = any>(
	// prettier-ignore
	select: { [K in keyof I]: { dependencies: string[], value?: (...dependencies: any[]) => Promise<I[K]> } },
	Preloader: React.FunctionComponent = () => <>loading...</>,
) {
	return <E extends T>(Consumer: React.ComponentType<E & I>) => {
		const [ , decoratedComponentNameMatch = '' ] = componentNameRegexp.exec(Consumer.toString()) || [];
		const className = `DI.Injector(${decoratedComponentNameMatch})`;

		function DIInjector(props: E) {
			const injectedState = useInjector<I>(select);

			if (Object.keys(injectedState).length > 0) {
				return <Consumer {...props} {...injectedState} />;
			}

			return <Preloader />;
		}

		// changes name for debuging
		(DIInjector as any).displayName = className;

		hoistNonReactStatic(DIInjector, Consumer);

		return DIInjector as React.ComponentType<E>;
	};
}
