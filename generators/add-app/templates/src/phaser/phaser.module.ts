import { interfaces } from 'inversify';

import { IApplication } from 'lib/interfaces';

import { IPhaserGameProvider, PhaserGameProvider } from './phaser-game.provider';
import { IntroSceneProvider } from './scene/intro.scene';

// TODO: move to interfaces
export type IPhaserProvider = () => Promise<any>;

// prettier-ignore
export default class PhaserModule {
	public static register(app: IApplication) {
		const console: Console = app.get<Console>('debug:console:DEBUG_PHASER');
		console.debug('PhaserModule:register');

		app.bind<IPhaserProvider>('phaser:provider')
			.toProvider(() => () =>
				import(/* webpackChunkName: "phaser" */ './phaser')
					.then(({ default: Phaser }) => Phaser),
			);
		app.bind<IPhaserGameProvider>('phaser:game-provider').toProvider(PhaserGameProvider);
		app.bind('phaser:scene:intro:provider').toProvider(IntroSceneProvider);
		app.bind('phaser:plugins')
			.toProvider((context: interfaces.Context) => () =>
				import(/* webpackChunkName: "phaser" */ 'lib/phaser/ui-manager.plugin')
					.then(async ({ UIManagerPluginProvider }) => await UIManagerPluginProvider(context)())
					.then((UIManagerPlugin) => ({
						key: 'ui:manager',
						start: true,
						plugin: UIManagerPlugin,
					})),
			);
	}
}
