import { interfaces } from 'inversify';
import { IApplication } from 'lib/interfaces';

import { IAudioFileLoader, IAudioFileLoaderProvider } from './interfaces';

export default class AudioLoaderModule {
	public static register(app: IApplication) {
		app.bind<IAudioFileLoaderProvider>('audio-loader:provider')
			.toProvider(({ container }: interfaces.Context) => () =>
				import(/* webpackChunkName: "audio" */ './audio-loader.service')
					.then(({ AudioLoaderService }) => {
						if (!container.isBound('audio-loader')) {
							container
								.bind<IAudioFileLoader>('audio-loader')
								.to(AudioLoaderService)
								.inSingletonScope();
						}
						return container.get<IAudioFileLoader>('audio-loader');
					}));
	}
}
