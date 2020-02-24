import { interfaces } from 'inversify';
import { IApplication } from 'lib/interfaces';

import { AudioBufferRepository } from './audio-buffer-repository';
import { AudioMixer } from './audio-mixer';
import { AudioMixerTrack } from './audio-mixer-track';
import { IAudioContextFactory, IAudioMixer, IAudioTrack } from './interfaces';

export default class AudioModule {
	public static register(app: IApplication) {
		// we don't want to provide AudioContext just as value because we want to wait for it being needed
		app.bind<IAudioContextFactory>('audio-context:factory').toFactory(({ container }: interfaces.Context) => {
			if (!container.isBound('audio-context')) {
				container.bind('audio-context').toConstantValue(new AudioContext());
			}
			return container.get('audio-context');
		});

		app.bind<AudioBufferRepository>('audio-repository')
			.to(AudioBufferRepository)
			.inSingletonScope();
		app.bind<IAudioTrack>('audio-mixer:track:master')
			.to(AudioMixerTrack)
			.inSingletonScope();
		app.bind<IAudioTrack>('audio-mixer:track:effects')
			.to(AudioMixerTrack)
			.inSingletonScope();
		app.bind<IAudioTrack>('audio-mixer:track:music')
			.to(AudioMixerTrack)
			.inSingletonScope();
		app.bind<IAudioTrack>('audio-mixer:track:dialog')
			.to(AudioMixerTrack)
			.inSingletonScope();
		app.bind<IAudioMixer>('audio-mixer')
			.to(AudioMixer)
			.inSingletonScope();
	}
}
