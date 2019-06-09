import { interfaces } from 'inversify';

export type IPhaserProvider = () => Promise<any>;

export const lazyPhaserAudioLoaderServiceProvider = (context: interfaces.Context) => () =>
	import(/* webpackChunkName: "phaser-audio" */ './phaser-audio-loader.service').then(
		async ({ PhaserAudioLoaderServiceProvider }) => await PhaserAudioLoaderServiceProvider(context)(),
	);
