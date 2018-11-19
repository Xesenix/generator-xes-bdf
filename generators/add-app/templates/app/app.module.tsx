import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { EventEmitter } from 'events';
import { Container } from 'inversify';

import { DataStoreModule } from 'lib/data-store';
import { DIContext } from 'lib/di';
import { FullScreenModule } from 'lib/fullscreen';
import {
	defaultI18nState,
	I18nModule,
	i18nReducer,
	II18nProvider,
	II18nState,
} from 'lib/i18n';
import { IValueAction } from 'lib/interfaces';
import { IRenderer, ReactRenderer } from 'lib/renderer/react-renderer';
import { SoundModule } from 'lib/sound';
import { SoundScapeModule } from 'lib/sound-scape';
import { defaultUIState, IUIState, UIModule, uiReducer } from 'lib/ui';

import OutletComponent from '../components/outlet/outlet';
import { PhaserGameModule } from '../src/phaser/game.module';

import App from './app';

declare const process: any;

type IAppState = IUIState & II18nState | undefined;
type AppAction = IValueAction;

/**
 * Main module for application. Defines all dependencies and provides default setup for configuration variables.
 *
 * @export
 * @extends {Container}
 */
export class AppModule extends Container {
	constructor() {
		super();

		// console
		if (process.env.DEBUG === 'true') {
			this.bind<Console>('debug:console').toConstantValue(console);
		} else {
			// tslint:disable:no-empty
			const noop = () => {};
			this.bind<Console>('debug:console').toConstantValue({
				assert: noop,
				debug: noop,
				error: noop,
				log: noop,
				trace: noop,
				group: noop,
				groupEnd: noop,
			} as Console);
		}

		// event manager
		this.bind<EventEmitter>('event-manager').toConstantValue(new EventEmitter());

		// load modules

		// fullscreen bindings
		FullScreenModule.register(this);

		// sound
		SoundModule.register(this);
		SoundScapeModule.register(this);

		// translations
		this.load(I18nModule());

		// phaser
		this.load(PhaserGameModule());

		// data store
		this.load(DataStoreModule<IAppState, AppAction>({
			...defaultUIState,
			...defaultI18nState,
		}, (state: IAppState, action: AppAction) => {
			const console = this.get<Console>('debug:console');
			console.log('reduce', state, action);
			state = uiReducer<IAppState, AppAction>(state, action);
			state = i18nReducer<IAppState, AppAction>(state, action);
			return state;
		}));

		// rendering DOM
		this.bind<HTMLElement>('ui:root').toConstantValue(document.getElementById('app') as HTMLElement);
		this.bind<React.ComponentFactory<any, any>>('ui:outlet-component').toConstantValue(React.createFactory(OutletComponent));
		this.bind<IRenderer>('ui:renderer').to(ReactRenderer).inSingletonScope();

		// ui
		this.load(UIModule());
	}

	public banner() {
		const console = this.get<Console>('debug:console');
		// prettier-ignore
		// tslint:disable:max-line-length
		console.log('%c  ★★★ Black Dragon Framework ★★★  ',
			'display: block; line-height: 3rem; border-bottom: 5px double #a02060; font-family: fantasy; font-size: 2rem; color: #f02060; background-color: #000;',
		);
		console.log(`%c  author: ${ process.env.APP.templateData.author.padEnd(37) }\n%c     app: ${ process.env.APP.templateData.title.padEnd(37) }`,
			'line-height: 1.25rem; font-family: Consolas; font-weight: bold; font-size: 1.25rem; color: #a060d0; background-color: #000;',
			'line-height: 1.25rem; font-family: Consolas; font-weight: bold; font-size: 1.25rem; color: #a060d0; background-color: #000; border-bottom: 1px solid #600080;',
		);
	}

	public boot(): Promise<AppModule> {
		// start all required modules
		return this.get<II18nProvider>('i18n:provider')()
			.then(this.get<FullScreenModule>('fullscreen:module').boot)
			.then(() => {
				this.banner();
				this.get<EventEmitter>('event-manager').emit('app:boot');

				// const game = this.get<AncientMaze<IGameObjectState, IAncientMazeState<IGameObjectState>>>('game');
				// game.boot();

				const container = this.get<HTMLElement>('ui:root');

				ReactDOM.render(<DIContext.Provider value={ this }><App/></DIContext.Provider>, container);
				// ReactDOM.render(<App/>, container);

				return this;
			}, (error) => {
				console.error(error);

				return this;
			});
	}
}
