import { interfaces } from 'inversify';
import { IApplication } from 'lib/interfaces';

import { IAudioFileLoaderProvider } from 'lib/audio/interfaces';

export default class PhaserAudioLoaderModule {
	public static register(app: IApplication) {
		app.bind<IAudioFileLoaderProvider>('audio-loader:provider')
			.toProvider((context: interfaces.Context) => () =>
				import(/* webpackChunkName: "phaser-audio" */ './audio/audio-loader.service')
					.then(({ PhaserAudioLoaderServiceProvider: provider }) => provider(context)()));
	}
}
