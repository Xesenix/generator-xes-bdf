import { interfaces } from 'inversify';

export const lazyPhaserSoundtrackManagerPluginProvider = (
	// prettier-ignore
	context: interfaces.Context,
) => (config = { key: 'soundtrack-manager', start: true }) =>
	import(/* webpackChunkName: "phaser" */ './soundtrack-manager-plugin')
		.then(async ({ PhaserSoundtrackManagerPluginProvider: provider }) => await provider(context)(),)
		.then((SoundtrackManagerPlugin) => ({
			...config,
			plugin: SoundtrackManagerPlugin,
		}));
