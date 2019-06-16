import { EventEmitter } from 'eventemitter3';
import { Container } from 'inversify';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Game } from 'game/game';
import { DataStore, IGameState } from 'game/store';
import { DataStoreModule } from 'lib/data-store';
import { DebugModule } from 'lib/debug';
import { DIContext } from 'lib/di';
import { FullScreenModule } from 'lib/fullscreen';
import { I18nModule, II18nState } from 'lib/i18n';
import { IApplication, IEventEmitter, IValueAction } from 'lib/interfaces';
import { ServiceWorkerModule } from 'lib/service-worker';
import { SoundModule } from 'lib/sound';
import { SoundScapeModule } from 'lib/sound-scape';<% if (usePhaser) { %>
import { PhaserGameModule } from 'phaser/game.module';<% } %>
import { ThemeModule } from 'theme';
import { DefaultThemeModule } from 'themes/default/default-theme.module';
import { ModernThemeModule } from 'themes/modern/modern-theme.module';
import { SharpThemeModule } from 'themes/sharp/sharp-theme.module';
import { IUIState, UIModule } from 'ui';

import { initialGameState } from '../data/initial-state';
import App from './app';

declare const process: any;

type IAppState = IUIState & II18nState | undefined;
type AppAction = IValueAction<any>;

/**
 * Main module for application. Defines all dependencies and provides default setup for configuration variables.
 *
 * @export
 * @extends {Container}
 */
export class AppModule extends Container implements IApplication {
	public eventManager: IEventEmitter = new EventEmitter();

	constructor() {
		super();

		if ((window as any).__inversifyDevtools__) {
			(window as any).__inversifyDevtools__(this);
		}

		ServiceWorkerModule.register();

		DebugModule.register(this);

		// event manager
		this.bind<IEventEmitter>('event-manager').toConstantValue(this.eventManager);

		// load modules

		// application themeing
		ThemeModule.register(this);
		DefaultThemeModule.register(this);
		SharpThemeModule.register(this);
		ModernThemeModule.register(this);

		// fullscreen bindings
		FullScreenModule.register(this, document.querySelector('body') as HTMLElement);

		// sound
		SoundModule.register(this);
		SoundScapeModule.register(this);

		// translations
		I18nModule.register(this);<% if (usePhaser) { %>

		// phaser
		this.load(PhaserGameModule(this));<% } %>

		// data store
		DataStoreModule.register<IAppState, AppAction>(this);

		// rendering DOM - from outside of react
		this.bind<Window>('window').toConstantValue(window);
		this.bind<HTMLElement>('ui:root').toConstantValue(document.getElementById('app') as HTMLElement);

		// ui
		UIModule.register(this);

		// game
		const dataStore = new DataStore<IGameState>({} as any, this.eventManager);
		const game = new Game(initialGameState, dataStore);

		this.bind<Game>('game').toConstantValue(game);
	}

	public banner() {
		const console = this.get<Console>('debug:console');
		console.debug('AppModule:booted');
		// tslint:disable:max-line-length
		console.log(
			'%c  ★★★ Black Dragon Framework ★★★  ',
			'display: block; line-height: 3rem; border-bottom: 5px double #a02060; font-family: fantasy; font-size: 2rem; color: #f02060; background-color: #000;',
		);
		console.log(
			`%c  author: ${process.env.APP.templateData.author.padEnd(37)}\n%c     app: ${process.env.APP.templateData.title.padEnd(37)}`,
			'line-height: 1.25rem; font-family: Consolas; font-weight: bold; font-size: 1.25rem; color: #a060d0; background-color: #000;',
			'line-height: 1.25rem; font-family: Consolas; font-weight: bold; font-size: 1.25rem; color: #a060d0; background-color: #000; border-bottom: 1px solid #600080;',
		);
	}

	public boot(): Promise<AppModule> {
		// start all required modules
		const console = this.get<Console>('debug:console');
		const providers = this.getAll('boot');
		let progress = 0;

		return Promise.all(providers.map((provider: any) => provider().then(() => console.debug(`AppModule:boot:progress ${++progress}/${providers.length}`))))
			.then(
				() => {
					this.banner();
					this.get<IEventEmitter>('event-manager').emit('app:boot');

					const container = this.get<HTMLElement>('ui:root');

					ReactDOM.render((
							<DIContext.Provider value={this}>
								<App />
							</DIContext.Provider>
						),
						container,
					);

					return this;
				},
				(error) => {
					console.error(error);

					return this;
				},
			);
	}
}

