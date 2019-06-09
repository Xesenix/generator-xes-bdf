import { Container } from 'inversify';
import * as React from 'react';

import { DIContext } from './context';

/**
 * @template I interface for properties injected via dependency injection
 * @param select map dependencies from container to properties names injected into decorated component properties
 */
export function useInjector<I>(select: { [K in keyof I]: { dependencies: string[], value?: (...dependencies: any[]) => Promise<I[K]> } }) {
	const [injectedState, setState] = React.useState<I>({} as I);
	const keys = Object.keys(select);
	const di: Container | null = React.useContext(DIContext);

	React.useEffect(() => {
		let isMounted: boolean = true;

		if (!!di) {
			const configs = Object.values<{
				dependencies: string[];
				value?: (...dependencies: any[]) => Promise<any>;
			}>(select);

			const nameRegexp = /\@([a-zA-Z0-9_-]+)/;
			const callRegexp = /(\(\))/;
			const multipleRegexp = /(\[\])$/;

			Promise.all(
				configs.map(
					// prettier-ignore
					({
						value = (dep: any) => Promise.resolve(dep),
						dependencies,
					}) => value.apply({}, dependencies.map((key) => {
						const nameMatch = nameRegexp.exec(key);
						const callMatch = callRegexp.exec(key);
						const multipleMatch = multipleRegexp.exec(key);
						const callable = !!callMatch;
						let injection: any;

						// handling keys with call signature:
						// some_key()
						if (!!callMatch) {
							key = key.replace(callMatch[0], '');
						}

						if (!!multipleMatch) {
							key = key.replace(multipleMatch[0], '');
						}

						// handling keys with named dependencies like:
						// some_key@name
						if (!!multipleMatch) {
							if (!!nameMatch) {
								key = key.replace(nameMatch[0], '');
								injection = di.getAllNamed<any>(key, nameMatch[1]);
							} else {
								injection = di.getAll<any>(key);
							}
						} else {
							if (!!nameMatch) {
								key = key.replace(nameMatch[0], '');
								injection = di.getNamed<any>(key, nameMatch[1]);
							} else {
								injection = di.get<any>(key);
							}
						}

						return callable ? injection() : injection;
					})),
				),
			)
			.then((values: any[]) => {
				if (isMounted) {
					const state = values.reduce((result, value, index) => {
						result[keys[index]] = value;
						return result;
					}, {});
					setState(state);
				}
			});
		}

		return () => {
			isMounted = false;
		};
	}, [di]);

	return injectedState;
}
