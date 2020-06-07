import { Container } from 'inversify';
import 'reflect-metadata';

import EventManagerModule from 'lib/core/event-manager.module';
import DataStoreModule from 'lib/data-store/data-store.module';
import DebugModule from 'lib/debug/debug.module';
import { IApplication, IEventEmitter } from 'lib/interfaces';

/**
 * Worker entry point. Defines all dependencies and provides default setup for configuration variables.
 *
 * @export
 * @extends {Container}
 */
export default class WorkerAppModule extends Container implements IApplication {
	constructor(worker) {
		super();

		this.bind('worker').toConstantValue(worker);

		// core dependencies
		DebugModule.register(this);
		EventManagerModule.register(this);
		DataStoreModule.register(this);
	}

	public banner() {
		const console = this.get<Console>('debug:console');
		console.debug('WorkerAppModule:booted');
		// tslint:disable:max-line-length
		console.log(
			'%c  ★★★ Black Dragon Framework ★★★  ',
			'display: block; line-height: 3rem; font-family: fantasy; font-size: 2rem; color: #f02060; background-color: #000;',
		);
		console.log(
			'%c                         worker                            ',
			'display: block; line-height: 2rem; border-bottom: 5px double #a02060; font-family: Consolas; font-size: 1rem; color: #f02060; background-color: #000;',
		);
		console.log(
			`%c  author: ${process.env.APP.templateData.author.padEnd(37)}\n%c     app: ${process.env.APP.templateData.title.padEnd(37)}`,
			'line-height: 1.25rem; font-family: Consolas; font-weight: bold; font-size: 1.25rem; color: #a060d0; background-color: #000;',
			'line-height: 1.25rem; font-family: Consolas; font-weight: bold; font-size: 1.25rem; color: #a060d0; background-color: #000; border-bottom: 1px solid #600080;',
		);
	}

	public boot(): Promise<void[]> {
		const console = this.get<Console>('debug:console');
		const providers = this.isBound('boot') ? this.getAll<() => Promise<void>>('boot') : [];
		let progress = 0;

		return Promise.all(
			providers.map((provider: any) => provider().then(() => {
				console.debug(`WorkerAppModule:boot:progress ${++progress}/${providers.length}`);
			})),
		);
	}

	public run(): Promise<IApplication> {
		// start all required modules
		return this.boot()
			.then(() => this.start())
			.then(
				({ default: App }) => {
					this.banner();
					this.get<IEventEmitter>('event-manager').emit('app:boot', { App });

					return this;
				},
				(error) => {
					const console = this.get<Console>('debug:console');
					console.error(error);

					return this;
				},
			);
	}

	protected start(): Promise<{ default: any }> {
		return Promise.resolve({ default: () => {} });
	}
}
