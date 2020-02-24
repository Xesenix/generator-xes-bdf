import { Container } from 'inversify';
import * as React from 'react';

import { DIContext } from './context';
import { getDependencies } from './get-dependencies';

/**
 * Hook for collecting dependencies from DI Container via react context.
 * @template I interface for properties injected via dependency injection
 * @param select map dependencies from container to properties names injected into decorated component properties
 * @param whenReady promise signaling when dependencies can be injected
 */
export function useInjector<I>(
	select: { [K in keyof I]: { dependencies: string[]; value?: (...dependencies: any[]) => Promise<I[K]> } },
	whenReady: Promise<void> = Promise.resolve(),
) {
	const [injectedState, setState] = React.useState<I>({} as I);
	const keys = Object.keys(select);
	const di: Container | null = React.useContext(DIContext);

	React.useEffect(() => {
		let isMounted: boolean = true;

		// one time initialization
		if (Object.keys(injectedState).length === 0 && !!di) {
			const configs = Object.values<{
				dependencies: string[];
				value?: (...dependencies: any[]) => Promise<any>;
			}>(select);

			Promise.all(
				configs.map(
					// prettier-ignore
					async ({
						value = (dep: any) => Promise.resolve(dep),
						dependencies,
					}) => value.apply({}, await getDependencies(di, dependencies)),
				),
			)
			.then((values: any[]) => {
				if (isMounted) {
					const state = values.reduce((result, value, index) => {
						result[keys[index]] = value;
						return result;
					}, {});

					whenReady.then(() => {
						setState(state);
					});
				}
			});
		}

		return () => {
			isMounted = false;
		};
	}, [di, injectedState]);

	return injectedState;
}
