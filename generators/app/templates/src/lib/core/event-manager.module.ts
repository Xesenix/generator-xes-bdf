import { EventEmitter } from 'eventemitter3';
import memoize from 'lodash-es/memoize';

import { IApplication, IEventEmitter } from 'lib/interfaces';

/**
 * Defines services:
 * @example
 * app.get<(name: string) => IEventEmitter>('event-manager:repository') // repository for named event emitters
 * app.get<IEventEmitter>('event-manager') // event emitter defined for `main` key
 */
export default class EventManagerModule {
	public static register(app: IApplication) {
		app.bind<(name: string) => IEventEmitter>('event-manager:repository').toFactory(() => {
			return memoize((name: string) => new EventEmitter());
		});
		app.bind<IEventEmitter>('event-manager').toConstantValue(app.get<(name: string) => IEventEmitter>('event-manager:repository')('main'));
	}
}
