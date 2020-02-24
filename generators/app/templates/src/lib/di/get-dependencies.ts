import { Container } from 'inversify';

import { IDependencyDescriptor } from './interfaces';
import { parseDependencyDescriptor } from './parse-dependency-descriptor';

/**
 * Uses dependency injection container to resolve dependencies.
 *
 * @param container dependency injection container
 * @param dependencies list identifiers of required dependencies in addition if identifier ends with '()' it will resolve provider result before injecting it
 */
export function getDependencies<T = any>(
	container: Container,
	dependencies: string[],
) {
	return Promise.all<T>(
		dependencies.map(async (descriptor: string | Partial<IDependencyDescriptor>) => {
			const {
				key,
				tag,
				multiple,
				callable,
			} = parseDependencyDescriptor(descriptor);

			let injection: any;

			if (multiple) {
				if (tag !== null) {
					// some_key@tag=value[]
					// some_key@name[]
					injection = container.getAllTagged<any>(key, tag.key, tag.value);
				} else {
					// some_key[]
					injection = container.getAll<any>(key);
				}

				return Promise.all(callable ? injection.map((dep) => dep()) : injection);
			} else {
				if (tag !== null) {
					// some_key@tag=value
					// some_key@name
					injection = container.getTagged<any>(key, tag.key, tag.value);
				} else {
					// some_key
					injection = container.get<any>(key);
				}
			}

			return Promise.resolve(callable ? injection() : injection);
		}),
	);
}
