import { interfaces } from 'inversify';
import { IApplication } from 'lib/interfaces';

export default class PhaserAudioModule {
	public static register(app: IApplication) {
		// TODO: this factory returns class figure out how to correctly type this binding
		app.bind('phaser:plugins')
			.toProvider((context: interfaces.Context) => () =>
				import(/* webpackChunkName: "phaser-audio" */ './audio/audio-manager-plugin')
					.then(({ PhaserAudioManagerPluginProvider: provider }) => provider(context)())
					.then((AudioManagerPlugin) => ({
						key: 'audio-manager', // phaser plugin key
						start: true, // phaser auto start
						plugin: AudioManagerPlugin,
					})),
			);
	}
}
