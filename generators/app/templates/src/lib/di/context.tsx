import * as React from 'react';

import { Container } from 'inversify';

// tslint:disable:max-classes-per-file

export const DIContext = React.createContext<Container | null>(null);

/**
 * Add DI container to decorated component properties.
 *
 * @export
 * @template T component properties interface including dependency injection container under `di` property
 * @param Consumer component into which we want to inject dependency injection container
 * @returns component with injected DI container property under `di` property
 */
export function connectToDI<T>(Consumer) {
	class DIConsumer extends React.Component<T, {}> {
		public render() {
			return <DIContext.Consumer>{(container: Container | null) => <Consumer {...this.props} di={container} />}</DIContext.Consumer>;
		}
	}

	return DIConsumer;
}

/**
 * Map dependencies from DI container into component properties.
 *
 * @export
 * @template T component properties interface including properties injected via dependency injection and also dependency injection container
 * @param Consumer component into which we want to inject dependencies from dependency container
 * @param select map dependencies from container to properties names injected into decorated component properties
 * @returns component with injected values from DI container
 */
export function connectToInjector<T>(
	// prettier-ignore
	select: { [name: string]: { dependencies: string[], value?: (...dependencies: any[]) => Promise<any> } },
	Preloader: React.ReactNode = () => <>{`loading...`}</>,
) {
	return (Consumer: React.Component) => {
		class DIInjector extends React.Component<T & { di: Container }, {}> {
			public componentDidMount() {
				const { di } = this.props;

				if (!!di) {
					const keys = Object.keys(select);
					const configs = Object.values(select);

					Promise.all(configs.map(
						({
							value = (dep: any) => Promise.resolve(dep),
							dependencies,
						}) => value.apply({}, dependencies.map((key) => di.get<any>(key))),
					)).then((values: any[]) => {
						const state = values.reduce((result, value, index) => {
							result[keys[index]] = value;
							return result;
						}, {});
						this.setState(state);
					});
				}
			}

			public render() {
				if (!!this.state) {
					return <Consumer {...this.props} {...this.state} />;
				}

				return <Preloader />;
			}
		}

		return connectToDI<T>(DIInjector);
	};
}
