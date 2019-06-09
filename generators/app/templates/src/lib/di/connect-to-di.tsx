import hoistNonReactStatic from 'hoist-non-react-statics';
import { Container } from 'inversify';
import * as React from 'react';

import { DIContext } from './context';

/**
 * Add DI container to decorated component properties.
 *
 * @export
 * @template T component properties interface including dependency injection container under `di` property
 * @param Consumer component into which we want to inject dependency injection container
 * @returns component with injected DI container property under `di` property
 */
export function connectToDI<T>(Consumer: React.ComponentType<T & { di: Container | null }>) {
	function DIContainerConsumer(props: T) {
		const container: Container | null = React.useContext(DIContext);
		return <Consumer {...props} di={container} />;
	}

	// changes name for debuging
	(DIContainerConsumer as any).displayName = 'DIContainer.Consumer';

	hoistNonReactStatic(DIContainerConsumer, Consumer);

	return DIContainerConsumer;
}
