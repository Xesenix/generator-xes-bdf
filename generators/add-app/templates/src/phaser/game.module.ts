import { ContainerModule, interfaces } from 'inversify';

import { IPhaserGameProvider, PhaserGameProvider } from './game.provider';

// TODO: move to interfaces
export type IPhaserProvider = () => Promise<any>;

export const PhaserGameModule = () => new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind) => {
	// TODO: provide own implementation od Phaser so we dont include not needed functionalities
	bind<IPhaserProvider>('phaser:provider').toProvider(() => () => import('phaser'));
	bind<IPhaserGameProvider>('phaser:game-provider').toProvider(PhaserGameProvider);
});
