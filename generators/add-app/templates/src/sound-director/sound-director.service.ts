import { Store } from 'redux';

import { IAudioFileLoader, IAudioFileLoaderProvider } from 'lib/audio/interfaces';
import { IStateAwareAudioMixer } from 'lib/audio/interfaces';
import { inject } from 'lib/di/decorators';
import { IEventEmitter } from 'lib/interfaces';
import { ISoundtrack, ISoundtrackPlayer } from 'lib/sound-scape/interfaces';

@inject([
	'event-manager',
	'data-store',
	'audio-mixer',
	'audio-loader:provider',
	'sound-scape:soundtrack-player',
	{ type: 'soundtrack', named: 'ambient', },
	{ type: 'soundtrack', named: 'action', },
])
export class SoundDirectorService {
	private mode: 'idle' | 'action' = 'idle';
	private unsubscribe?: () => void;

	constructor(
		private em: IEventEmitter,
		private store: Store,
		private audioMixer: IStateAwareAudioMixer,
		private audioLoaderProvider: IAudioFileLoaderProvider,
		private soundtrackPlayer: ISoundtrackPlayer,
		private ambient: ISoundtrack,
		private action: ISoundtrack,
	) {

	}


	public start() {
		this.em.on('mode:change', (mode: 'idle' | 'action') => {
			if (mode !== this.mode) {
				if (mode === 'action') {
					this.enterActionMode();
				} else {
					this.enterIdleMode();
				}
			}
		});

		this.unsubscribe = this.store.subscribe(this.syncWithState);
		this.syncWithState();

		return this.audioLoaderProvider().then((audioLoader: IAudioFileLoader) => {
			// TODO: define in dependency injection
			audioLoader.add('soundtrack', 'assets/soundtrack.ogg');

			return audioLoader.loadAll();
		}).then(() => {
			this.soundtrackPlayer.scheduleAfterLast(this.ambient, 0);
		});
	}

	public end() {
		if (this.unsubscribe) {
			this.unsubscribe();
		}
	}

	private enterIdleMode() {
		if (this.mode !== 'idle') {
			this.soundtrackPlayer.scheduleNext(this.ambient, 0);
			this.mode = 'idle';
		}
	}

	private enterActionMode() {
		if (this.mode !== 'action') {
			this.soundtrackPlayer.scheduleNext(this.action, 0);
			this.mode = 'action';
		}
	}

	private syncWithState = () => {
		const state = this.store.getState();
		this.audioMixer.syncWithState(state);
	}
}
