import { interfaces } from 'inversify';
import { Store } from 'redux';

import { createClassProvider } from 'lib/di';

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
		return createClassProvider('phaser:game', [
			// prettier-ignore
			'data-store:provider()',
			'phaser:container',
			'phaser:provider()',
			'phaser:scene:intro:provider()',
			'phaser:plugins[]()',
		], async (
			// prettier-ignore
			store: Store,
			parent,
			Phaser,
			IntroScene,
			plugins,
		) => {
			console.debug('PhaserGameProvider:injected', {
				store,
				parent,
				Phaser,
				IntroScene,
				plugins,
				forceNew,
			});

			if (!forceNew && game !== null) {
				console.debug('PhaserGameProvider:swap parent', game);
				parent.appendChild(game.canvas);
				// fix canvas size after changing parent component
				game.scale.parent = parent;
				game.scale.getParentBounds();
				game.scale.refresh();

				return game;
			}

			const backgroundColor: any = 0x340000;
			const screenWidth = 800;
			const screenHeight = 600;

			/** @see https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js */
			const fps: Phaser.Types.Core.FPSConfig = {
				min: 10,
				target: 30,
				forceSetTimeOut: false,
				deltaHistory: 10,
				panicMax: 120,
			};

			const loader: Phaser.Types.Core.LoaderConfig = {};

			const render: Phaser.Types.Core.RenderConfig = {
				// resolution: 1,
				// antialias: true,
				// roundPixels: true,
				// autoResize: true,
				// backgroundColor,
				pixelArt: false, // => antialias: false, roundPixels: true
				transparent: false,
				clearBeforeRender: false,
				premultipliedAlpha: true,
				// preserveDrawingBuffer: false,
				failIfMajorPerformanceCaveat: false,
				powerPreference: 'default', // 'high-performance', 'low-power' or 'default'
			};

			const config: Phaser.Types.Core.GameConfig = {
				audio: {
					noAudio: true,
				} as Phaser.Types.Core.AudioConfig,
				width: screenWidth,
				height: screenHeight,
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
						...plugins,
					],
				},
				scene: [IntroScene],
				scale: {
					mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
					width: screenWidth,
					height: screenHeight,
				},
			};

			game = new Phaser.Game(config);

			try {
				console.debug('PhaserGameProvider:game', game);

				return game as Phaser.Game;
			} catch (error) {
				console.debug('PhaserGameProvider:error', parent, error);
				return Promise.reject(error);
			}
		})(context)();
	};
}
