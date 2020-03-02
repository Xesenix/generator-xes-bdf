import { Container } from 'inversify';

import EventManagerModule from 'lib/core/event-manager.module';
import DebugModule from 'lib/debug/debug.module';
import {
	IApplication,
	IEventEmitter,
	IRegistrable,
} from 'lib/interfaces';

declare const process: any;

export default abstract class BaseAppModule extends Container implements IApplication {
	constructor(
		root: HTMLElement,
		document: Document,
		window: Window,
	) {
		super();

		if ((window as any).__inversifyDevtools__) {
			(window as any).__inversifyDevtools__(this);
		}

		// core dependencies
		DebugModule.register(this);
		EventManagerModule.register(this);

		// rendering DOM - from outside of react
		this.bind<Document>('document').toConstantValue(document);
		this.bind<Window>('window').toConstantValue(window);
		this.bind<HTMLElement>('ui:root').toConstantValue(root);
	}

	public banner() {
		const console = this.get<Console>('debug:console');
		console.debug('AppModule:booted');
		// tslint:disable:max-line-length
		console.log(
			'%c  ★★★ Black Dragon Framework ★★★  ',
			'display: block; line-height: 3rem; font-family: fantasy; font-size: 2rem; color: #f02060; background-color: #000;',
		);
		console.log(
			'%c                          main                             ',
			'display: block; line-height: 2rem; border-bottom: 5px double #a02060; font-family: Consolas; font-size: 1rem; color: #f02060; background-color: #000;',
		);
		console.log(
			`%c  author: ${process.env.APP.templateData.author.padEnd(37)}\n%c     app: ${process.env.APP.templateData.title.padEnd(37)}`,
			'line-height: 1.25rem; font-family: Consolas; font-weight: bold; font-size: 1.25rem; color: #a060d0; background-color: #000;',
			'line-height: 1.25rem; font-family: Consolas; font-weight: bold; font-size: 1.25rem; color: #a060d0; background-color: #000; border-bottom: 1px solid #600080;',
		);
	}

	public register() {
		return this.getDependencies()
			.then((modules) => modules.forEach(({ default: m }) => m.register(this)));
	}

	public boot(): Promise<void[]> {
		const console = this.get<Console>('debug:console');
		const providers = this.isBound('boot') ? this.getAll<() => Promise<void>>('boot') : [];
		let progress = 0;

		return Promise.all(
			providers.map((provider: any) => provider().then(() => {
				console.debug(`AppModule:boot:progress ${++progress}/${providers.length}`);
			})),
		);
	}

	public run(): Promise<IApplication> {
		// start all required modules
		return this.register()
			.then(() => this.boot())
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

	protected abstract getDependencies(): Promise<{ default: IRegistrable }[]>;

	protected abstract start(): Promise<{ default: any }>;
}
