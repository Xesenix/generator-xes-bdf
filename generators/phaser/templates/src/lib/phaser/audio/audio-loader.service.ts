import {
	// prettier-ignore
	IAudioBufferRepository,
	IAudioContextFactory,
	IAudioFileLoader,
} from 'lib/audio/interfaces';
import { createProvider, inject } from 'lib/di';

// prettier-ignore
export const PhaserAudioLoaderServiceProvider = createProvider('phaser-audio-loader-service', [
	// prettier-ignore
	'phaser:provider()',
	'debug:console',
], (
	// prettier-ignore
	Phaser,
	console: Console,
) => inject([
	// prettier-ignore
	'audio-repository',
	'audio-context:factory',
])(class PhaserAudioLoaderService implements IAudioFileLoader {
	public loader?: Phaser.Loader.LoaderPlugin;
	private loadQueue: boolean[] = [];

	constructor(
		// prettier-ignore
		private repository: IAudioBufferRepository,
		private context: IAudioContextFactory,
	) {
	}

	/**
	 * Phaser 3 loaders are scene specific so we need to set them in scene preloading method.
	 * TODO: ensure that this works with multiple scenes.
	 *
	 * @param loader phaser asset loader
	 */
	public setLoader(loader: Phaser.Loader.LoaderPlugin): void {
		this.loader = loader;
		// TODO: find better way to connect to phaser loader audio cache
		(this.loader as any).cacheManager.audio.events.on('add', (cache: Phaser.Cache.BaseCache, key: string, data: AudioBuffer) => {
			this.repository.add(key, data);
			this.loadQueue[key] = false;
		});
	}

	public add(key: string, url: string): void {
		if (!this.loadQueue[key]) {
			this.loadQueue[key] = true;
		}
		if (this.loader) {
			// TODO: phaser has mismatched interface for configuring audioContext so we need cast second argument to any
			this.loader.addFile(
				new Phaser.Loader.FileTypes.AudioFile(
					this.loader,
					{
						key,
						context: this.context,
						xhrSettings: {
							responseType: 'arraybuffer',
						},
					} as any,
					{
						type: 'audio',
						url,
					},
				),
			);
		}
	}

	public async loadAll(): Promise<void> {
		return await new Promise((resolve) => {
			if (Object.values(this.loadQueue).some((loading) => loading)) {
				if (this.loader) {
					this.loader.addListener('complete', () => {
						resolve();
					});
				}
			} else {
				resolve();
			}
		});
	}
}));
