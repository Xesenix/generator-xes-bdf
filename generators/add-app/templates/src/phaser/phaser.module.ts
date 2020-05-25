import { interfaces } from 'inversify';

import { IApplication } from 'lib/interfaces';

import { IPhaserApplicationProvider, PhaserApplicationProvider } from './providers/phaser-application.provider';
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
		app.bind<IPhaserApplicationProvider>('phaser:application:provider').toProvider(PhaserApplicationProvider);

		app.bind('phaser:plugins')
			.toProvider((context: interfaces.Context) => () =>
				import(/* webpackChunkName: "phaser" */ 'lib/phaser/plugins/ui-manager.plugin')
					.then(({ UIManagerPluginProvider: provider }) => provider(context)())
					.then((UIManagerPlugin) => ({
						key: 'ui:manager',
						start: true,
						plugin: UIManagerPlugin,
					})),
			);

		app.bind('phaser:scene:intro:provider').toProvider(IntroSceneProvider);
	}
}
