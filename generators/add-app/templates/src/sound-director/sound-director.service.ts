import { Store } from 'redux';

import { IAudioFileLoader, IAudioFileLoaderProvider } from 'lib/audio/interfaces';
import { IStateAwareAudioMixer } from 'lib/audio/interfaces';
import { inject } from 'lib/di/decorators';
import { IEventEmitter } from 'lib/interfaces';
import { ISoundtrack, ISoundtrackPlayer } from 'lib/sound-scape/interfaces';

type SoundtrackMode = 'ambient' | 'action';

@inject([
	'event-manager',
	'data-store',
	'audio-mixer',
	'audio-loader:provider',
	'sound-scape:soundtrack-player',
	{ type: 'soundtrack', named: 'ambient', },
])
export class SoundDirectorService {
	private mode: SoundtrackMode = 'ambient';
	private unsubscribe?: () => void;
	private soundtracks: { [modeName in SoundtrackMode]: ISoundtrack };

	constructor(
		private em: IEventEmitter,
		private store: Store,
		private audioMixer: IStateAwareAudioMixer,
		private audioLoaderProvider: IAudioFileLoaderProvider,
		private soundtrackPlayer: ISoundtrackPlayer,
		ambient: ISoundtrack,
	) {
		this.soundtracks = { ambient };
	}

	public start() {
		this.em.on('mode:change', (mode: SoundtrackMode) => {
			this.enterMode(mode);
		});

		this.unsubscribe = this.store.subscribe(this.syncWithState);
		this.syncWithState();

		return this.audioLoaderProvider()
			.then((audioLoader: IAudioFileLoader) => {
				// TODO: define in dependency injection
				audioLoader.add('soundtrack', 'assets/soundtrack.ogg');

				return audioLoader.loadAll();
			})
			.then(() => {
				this.soundtrackPlayer.scheduleAfterLast(this.soundtracks.ambient, 0);
			});
	}

	public end() {
		if (this.unsubscribe) {
			this.unsubscribe();
		}
	}

	private enterMode(modeName: SoundtrackMode = 'ambient') {
		if (this.mode !== modeName) {
			this.soundtrackPlayer.scheduleNext(this.soundtracks[modeName], 0);
			this.mode = modeName;
		}
	}

	private syncWithState = () => {
		const state = this.store.getState();
		this.audioMixer.syncWithState(state);
	}
}
