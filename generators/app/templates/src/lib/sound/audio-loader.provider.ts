import { interfaces } from 'inversify';

import { IAudioFileLoader } from './interfaces';

export const audioLoaderProvider = ({ container }: interfaces.Context) => () =>
	import('./audio-loader.service').then(({ AudioLoaderService }) => {
		if (!container.isBound('audio-loader')) {
			container
				.bind<IAudioFileLoader>('audio-loader')
				.to(AudioLoaderService)
				.inSingletonScope();
		}
		return container.get<IAudioFileLoader>('audio-loader');
	});
