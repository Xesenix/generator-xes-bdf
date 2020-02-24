import * as inversify from 'inversify';
import { Container, interfaces as ii } from 'inversify';
import memoize from 'lodash-es/memoize';

import { getDependencies } from './get-dependencies';
import { helpers, interfaces as vi } from './helpers';

type DependencyType = string | symbol | ii.Newable<any> | ii.Abstract<any> | vi.IBasicInjection | vi.INamedInjection | vi.ITaggedInjection;

/**
 * Annotate class with constructor dependency injection.
 */
export function inject(dependencies?: DependencyType[]): any {
	if (process.env.DEBUG_DI === 'true') {
		console.debug('annotation:inject:decorate', dependencies, inversify.injectable());
	}
	return (target, key, descriptor) => {
		if (process.env.DEBUG_DI === 'true') {
			console.debug('annotation:inject', target.name, dependencies);
		}
		helpers.annotate(target, dependencies);

		return target;
	};
}

/**
 * Annotate classes that can be injected as dependencies.
 */
export function injectable(): any {
	return (target, key, descriptor) => {
		if (process.env.DEBUG_DI === 'true') {
			console.debug('annotation:injectable', target.name);
		}
		inversify.decorate(inversify.injectable(), target);

		return target;
	};
}

/**
 * Uses context container to inject named dependencies into function.
 *
 * @param container dependency injection container
 * @param dependencies list identifiers of required dependencies in addition if identifier ends with '()' it will resolve provider result before injecting it
 * @param factory factory function into which we want to inject dependencies
 */
export async function resolveDependencies<T>(
	container: ii.Container,
	dependencies: string[],
	factory: (...args: any[]) => T,
) {
	return factory(...(await getDependencies<T>(container as Container, dependencies)));
}

/**
 * Uses context container to inject named dependencies into function.
 *
 * @param key unique identifier that will be used internally to store result of factory in container
 * @param dependencies list identifiers of required dependencies in addition if identifier ends with '()' it will resolve provider result before injecting it
 * @param factory factory function into which we want to inject dependencies
 * @param singleton if true will try resolve factory result from DIC else will return result of factory without further modifications
 * @returns provider function
 */
export function createProvider<T = any>(
	key: string,
	dependencies: string[],
	factory: (...args: any[]) => T,
	singleton: boolean = true,
	cache: boolean = true,
): (ctx: ii.Context) => () => Promise<T> {
	const cacheResult: (cb: (ctx: ii.Context) => any) => any = cache ? memoize : (cb: (ctx: ii.Context) => any) => cb;
	return cacheResult(({ container }: ii.Context) => async () => {
		const console = container.get<Console>('debug:console:DEBUG_DI');
		console.debug('annotation:injectDecorator', {
			key,
			dependencies,
			factory,
		});

		const constructor = resolveDependencies<T>(container, dependencies, factory);

		if (singleton) {
			if (!container.isBound(key)) {
				container
					.bind(key)
					.to(constructor as any)
					.inSingletonScope();
			}
			return container.get(key);
		}

		return constructor;
	});
}

/**
 * For classes that cannot be instantiated by DI we can create factories into which
 * we inject necessary dependencies.
 *
 * @export
 * @param key unique identifier that will be used internally to store result of factory in container
 * @param dependencies list identifiers of required dependencies in addition if identifier ends with '()' it will resolve provider result before injecting it
 * @param factory factory function into which we want to inject dependencies
 * @returns provider function returning object created by factory without further resolving
 */
export function createClassProvider<T = any>(
	key: string,
	dependencies: string[],
	factory: (...args: any[]) => any,
) {
	return createProvider<T>(key, dependencies, factory, false);
}
