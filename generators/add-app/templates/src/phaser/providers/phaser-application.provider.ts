import { interfaces } from 'inversify';
import { Store } from 'redux';

import { createClassProvider } from 'lib/di';

export type IPhaserApplicationProvider = (forceNew?: boolean) => Promise<Phaser.Game>;

declare const process: any;

// singleton
let app: Phaser.Game | null = null;

export function PhaserApplicationProvider(context: interfaces.Context) {
	const console: Console = context.container.get<Console>('debug:console:DEBUG_PHASER');
	console.debug('PhaserApplicationProvider');

	return (forceNew: boolean = false): Promise<Phaser.Game> => {
		console.debug('PhaserApplicationProvider:provide');

		if (!forceNew && app !== null) {
			return Promise.resolve(app);
		}

		// preload phaser module that is needed by subsequential modules
		// TODO: convert to observable so it can return progress on loading
		// prettier-ignore
		return createClassProvider('phaser:app', [
			// prettier-ignore
			'data-store:provider()',
			'phaser:provider()',
			'phaser:scene:intro:provider()',
			'phaser:plugins[]()',
		], async (
			// prettier-ignore
			store: Store,
			Phaser,
			IntroScene,
			plugins,
		) => {
			console.debug('PhaserApplicationProvider:injected', {
				store,
				Phaser,
				IntroScene,
				plugins,
				forceNew,
			});

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
				disableContextMenu: true,
				fps,
				render,
				backgroundColor,
				callbacks: {
					preBoot: (game) => {
						console.log('=== PRE BOOT', game);
					},
					postBoot: (game) => {
						console.log('=== POST BOOT', game);
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
				/*
				 * @see https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scalemanager/
				 */
				scale: {
					// autoCenter: Phaser.Scale.CENTER_BOTH, // NO_CENTER CENTER_BOTH CENTER_HORIZONTALLY CENTER_VERTICALLY
					// Phaser incorrectly scales view port to parent container
					// use Phaser.Scale.NONE separate system for scaling
					mode: Phaser.Scale.NONE, // NONE FIT ENVELOP WIDTH_CONTROLS_HEIGHT HEIGHT_CONTROLS_WIDTH RESIZE
					width: screenWidth,
					height: screenHeight,
				},
				title: process.env.APP.templateData.title,
				version: process.env.PACKAGE.version,
			};

			try {
				console.debug('PhaserApplicationProvider:app', app);

				app = new Phaser.Game(config);

				return app as Phaser.Game;
			} catch (error) {
				console.debug('PhaserApplicationProvider:error', parent, error);
				return Promise.reject(error);
			}
		})(context)();
	};
}
