import { Store } from 'redux';

import {
	// prettier-ignore
	IAudioBufferRepository,
	IAudioConfigurationState,
	IAudioFileLoader,
	IStateAwareAudioMixer,
} from 'lib/audio/interfaces';
import { createClassProvider } from 'lib/di';

// prettier-ignore
export const PhaserAudioManagerPluginProvider = createClassProvider('audio-manager-plugin', [
	// prettier-ignore
	'phaser:provider()',
	'data-store',
	'audio-context:factory',
	'audio-mixer',
	'audio-repository',
	'audio-loader:provider()',
	'debug:console:DEBUG_PHASER_SOUND',
], (
	// prettier-ignore
	Phaser,
	store: Store,
	context: AudioContext,
	audioMixer: IStateAwareAudioMixer,
	repository: IAudioBufferRepository,
	audioLoader: IAudioFileLoader,
	console: Console,
) => class PhaserAudioManagerPlugin extends Phaser.Plugins.BasePlugin {
	public store: Store<IAudioConfigurationState> = store;
	public loader?: Phaser.Loader.LoaderPlugin;
	public repository: IAudioBufferRepository = repository;
	public audioLoader: IAudioFileLoader = audioLoader;
	public audioMixer: IStateAwareAudioMixer = audioMixer;
	public context: AudioContext = context;
	private unsubscribe: any;

	constructor(
		// prettier-ignore
		public pluginManager: Phaser.Plugins.PluginManager,
	) {
		super(pluginManager);
		console.log('PhaserAudioManagerPlugin:constructor');
	}

	/**
	 * Phaser 3 loaders are scene specific so we need to set them in scene preloading method.
	 * TODO: ensure that this works with multiple scenes.
	 *
	 * @param loader phaser asset loader
	 */
	public setLoader(loader: Phaser.Loader.LoaderPlugin): void {
		if (!!(this.audioLoader as any).setLoader) {
			(this.audioLoader as any).setLoader(loader);
		}
	}

	public start(): void {
		console.log('PhaserAudioManagerPlugin:start', this);
		this.unsubscribe = this.store.subscribe(this.syncWithState);
		this.syncWithState();
	}

	public stop() {
		console.log('PhaserAudioManagerPlugin:stop');
		this.unsubscribe();
	}

	public preload(): Promise<void> {
		return this.audioLoader.loadAll();
	}

	public preloadAudioAsset(key: string, url: string): void {
		this.audioLoader.add(key, url);
	}

	public playFxSound(key: string): Promise<AudioBufferSourceNode> {
		console.log('PhaserAudioManagerPlugin:playFxSound', key);
		return Promise.resolve(this.audioMixer.getTrack('effects').play(key));
	}

	public stopSound(key: string): void {
		console.log('PhaserAudioManagerPlugin:stopSound', key);
		this.audioMixer.getTrack('music').stop();
	}

	public playLoop(key: string): Promise<AudioBufferSourceNode> {
		console.log('PhaserAudioManagerPlugin:playLoop', key);
		return Promise.resolve(this.audioMixer.getTrack('effects').playLoop(key));
	}

	private syncWithState = () => {
		const state = this.store.getState();
		this.audioMixer.syncWithState(state);
	}
});
