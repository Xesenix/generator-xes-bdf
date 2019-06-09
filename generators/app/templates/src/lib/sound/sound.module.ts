import { interfaces } from 'inversify';
import { IApplication } from 'lib/interfaces';

import { AudioBufferRepository } from './audio-buffer-repository';
import { audioLoaderProvider } from './audio-loader.provider';
import { AudioMixer } from './audio-mixer';
import { AudioMixerTrack } from './audio-mixer-track';
import { IAudioContextFactory, IAudioFileLoaderProvider, IAudioMixer, IAudioTrack } from './interfaces';
import { lazyPhaserAudioLoaderServiceProvider } from './phaser/phaser-audio-loader.provider';
import { lazyPhaserAudioManagerPluginProvider } from './phaser/phaser-audio-manager-plugin.provider';

export class SoundModule {
	public static register(app: IApplication) {
		app.bind<SoundModule>('sound:module').toConstantValue(new SoundModule(app));
	}

	constructor(
		// prettier-ignore
		private app: IApplication,
		phaser: boolean = true,
	) {
		// we dont want to provide AudioContext just as value because we want to wait for it being needed
		this.app.bind<IAudioContextFactory>('audio-context:factory').toFactory(({ container }: interfaces.Context) => {
			if (!container.isBound('audio-context')) {
				container.bind('audio-context').toConstantValue(new AudioContext());
			}
			return container.get('audio-context');
		});

		if (phaser) {
			// TODO: this factory returns class figure out how to correctly type this binding
			this.app.bind('audio-manager-plugin:provider').toProvider(lazyPhaserAudioManagerPluginProvider);
			this.app.bind<IAudioFileLoaderProvider>('audio-loader:provider').toProvider(lazyPhaserAudioLoaderServiceProvider);
		} else {
			this.app.bind<IAudioFileLoaderProvider>('audio-loader:provider').toProvider(audioLoaderProvider);
		}

		this.app
			.bind<AudioBufferRepository>('audio-repository')
			.to(AudioBufferRepository)
			.inSingletonScope();
		this.app
			.bind<IAudioTrack>('audio-mixer:track:master')
			.to(AudioMixerTrack)
			.inSingletonScope();
		this.app
			.bind<IAudioTrack>('audio-mixer:track:effects')
			.to(AudioMixerTrack)
			.inSingletonScope();
		this.app
			.bind<IAudioTrack>('audio-mixer:track:music')
			.to(AudioMixerTrack)
			.inSingletonScope();
		this.app
			.bind<IAudioTrack>('audio-mixer:track:dialog')
			.to(AudioMixerTrack)
			.inSingletonScope();
		this.app
			.bind<IAudioMixer>('audio-mixer')
			.to(AudioMixer)
			.inSingletonScope();
	}
}
