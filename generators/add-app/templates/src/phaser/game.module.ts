import { Container, ContainerModule, interfaces } from 'inversify';

import { UIManagerPluginProvider } from 'lib/phaser/ui-manager.plugin';

import { IPhaserGameProvider, PhaserGameProvider } from './game.provider';
import { IntroSceneProvider } from './scene/intro.scene';

// TODO: move to interfaces
export type IPhaserProvider = () => Promise<any>;

// prettier-ignore
export const PhaserGameModule = (container: Container) => new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
	bind<IPhaserProvider>('phaser:provider')
		.toProvider(() => () => import(/* webpackChunkName: "phaser" */ 'phaser')
			.then(({ default: Phaser }) => Phaser),
		);
	bind<IPhaserGameProvider>('phaser:game-provider').toProvider(PhaserGameProvider);
	bind('phaser:scene:intro:provider').toProvider(IntroSceneProvider);
	bind('phaser:ui-manager-plugin:provider').toProvider(UIManagerPluginProvider);
});
