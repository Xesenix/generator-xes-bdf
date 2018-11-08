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
			return <DIContext.Consumer>{ (container: Container | null) => <Consumer { ...this.props } di={ container }/> }</DIContext.Consumer>;
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
	Consumer: React.Component,
	select: { [key: string]: { name: string, value: (value: any) => Promise<any> } },
	Preloader: React.ReactNode = () => <>{ `loading...` }</>,
) {
	class DIInjector extends React.Component<T & { di: Container }, {}> {
		public componentDidMount() {
			const { di } = this.props;

			if (!!di) {
				const keys = Object.keys(select);
				const configs = Object.values(select);

				Promise.all(
					keys.map((key) => select[key].value(di.get(key))),
				).then((values: any[]) => {
					const state = values.reduce((result, value, index) => {
						result[configs[index].name] = value;
						return result;
					}, {});
					this.setState(state);
				});
			}
		}

		public render() {
			if (!!this.state) {
				return <Consumer {...this.props} {...this.state}/>;
			}

			return <Preloader/>;
		}
	}

	return connectToDI<T>(DIInjector);
}
