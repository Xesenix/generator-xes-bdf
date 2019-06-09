import { interfaces } from 'inversify';
import { Store } from 'redux';

import { createProvider } from 'lib/di';

export type IPhaserGameProvider = (forceNew?: boolean) => Promise<Phaser.Game>;

// singleton
let game: Phaser.Game | null = null;

export function PhaserGameProvider(context: interfaces.Context) {
	const console: Console = context.container.get<Console>('debug:console:DEBUG_PHASER');
	console.debug('PhaserGameProvider');

	return (forceNew: boolean = false): Promise<Phaser.Game> => {
		console.debug('PhaserGameProvider:provide');

		// preload phaser module that is needed by subsequential modules
		// TODO: convert to observable so it can return progress on loading
		// prettier-ignore
		return createProvider('phaser:game', [
			// prettier-ignore
			'data-store:provider()',
			'phaser:container',
			'phaser:provider()',
			'phaser:ui-manager-plugin:provider()',
			'phaser:scene:intro:provider()',
			'audio-manager-plugin:provider()',
			'soundtrack-manager-plugin:provider()',
		], (
			// prettier-ignore
			store: Store,
			parent,
			Phaser,
			UIManagerPlugin: Phaser.Plugins.BasePlugin,
			IntroScene,
			AudioManagerPlugin: Phaser.Plugins.BasePlugin,
			SoundtrackManagerPlugin: Phaser.Plugins.BasePlugin,
		) => {
			console.debug('PhaserGameProvider:injected', {
				store,
				parent,
				Phaser,
				UIManagerPlugin,
				IntroScene,
				AudioManagerPlugin,
				SoundtrackManagerPlugin,
			});

			if (!forceNew && game !== null) {
				console.debug('PhaserGameProvider:swap parent', game);
				parent.appendChild(game.canvas);
				// fix canvas size after changing parent component
				game.scale.parent = parent;
				game.scale.getParentBounds();
				game.scale.refresh();

				return Promise.resolve(game);
			}

			const backgroundColor: any = 0x000000;

			/** @see https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js */
			const fps: FPSConfig = {
				min: 10,
				target: 30,
				forceSetTimeOut: false,
				deltaHistory: 10,
				panicMax: 120,
			};

			const loader: LoaderConfig = {};

			const render: RendererConfig = {
				resolution: 1,
				antialias: false,
				autoResize: true,
				backgroundColor,
				pixelArt: true, // => antialias: false, roundPixels: true
				roundPixels: true,
				transparent: false,
				clearBeforeRender: false,
				premultipliedAlpha: true,
				preserveDrawingBuffer: false,
				failIfMajorPerformanceCaveat: false,
				powerPreference: 'default', // 'high-performance', 'low-power' or 'default'
			};

			const config: GameConfig = {
				audio: {
					noAudio: true,
				},
				width: 768,
				height: 300,
				type: Phaser.CANVAS, // AUTO, CANVAS, WEBGL, HEADLESS
				parent,
				disableContextMenu: true,
				fps,
				render,
				backgroundColor,
				callbacks: {
					preBoot: (x) => {
						console.log('=== PRE BOOT', x);
					},
					postBoot: (x) => {
						console.log('=== POST BOOT', x);
					},
				},
				loader,
				images: {
					// default: '',
					// missing: '',
				},
				plugins: {
					global: [
						{
							key: 'ui:manager',
							plugin: UIManagerPlugin,
							start: true,
						},
						{
							key: 'audio-manager',
							plugin: AudioManagerPlugin,
							start: true,
						},
						{
							key: 'soundtrack-manager',
							plugin: SoundtrackManagerPlugin,
							start: true,
						},
					],
				},
				scene: [IntroScene],
				scale: {
					mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
					width: 768,
					height: 300,
				},
			};

			game = new Phaser.Game(config);

			try {
				console.debug('PhaserGameProvider:game', game);

				return Promise.resolve(game as Phaser.Game);
			} catch (error) {
				console.debug('PhaserGameProvider:error', parent, error);
				return Promise.reject(error);
			}
		}, false, false)(context)();
	};
}
