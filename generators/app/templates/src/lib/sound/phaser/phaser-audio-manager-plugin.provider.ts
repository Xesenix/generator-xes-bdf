import { interfaces } from 'inversify';

export type IPhaserProvider = () => Promise<any>;

// prettier-ignore
export const lazyPhaserAudioManagerPluginProvider = (
	// prettier-ignore
	context: interfaces.Context,
) => () => import(/* webpackChunkName: "phaser-audio" */ './phaser-audio-manager-plugin')
	.then(async ({ AudioManagerPluginProvider }) => await AudioManagerPluginProvider(context)());
