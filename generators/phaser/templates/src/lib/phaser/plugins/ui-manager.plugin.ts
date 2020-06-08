import throttle from 'lodash-es/throttle';
import { Store } from 'redux';

import { createClassProvider } from 'lib/di';
import { IEventEmitter } from 'lib/interfaces';

export interface IUIState {
	mute: boolean;
	musicMuted: boolean;
	effectsMuted: boolean;
	paused: boolean;
	effectsVolume: number;
	musicVolume: number;
	volume: number;
}

// prettier-ignore
/**
 * TODO: Should handle full screen transition.
 * @see https://phaser.io/phaser3/devlog/138
 */
export const UIManagerPluginProvider = createClassProvider('phaser:ui-manager-plugin', [
	// prettier-ignore
	'phaser:provider()',
	'data-store:provider()',
	'event-manager',
	'window',
	'debug:console:DEBUG_PHASER',
], (
	// prettier-ignore
	Phaser,
	store: Store,
	em: IEventEmitter,
	window: Window,
	console: Console,
) => class UIManagerPlugin extends Phaser.Plugins.BasePlugin {
	public store: Store<IUIState> = store;
	private unsubscribe: any;

	constructor(
		// prettier-ignore
		public pluginManager: Phaser.Plugins.PluginManager,
	) {
		super(pluginManager);
		console.log('UIManagerPlugin:constructor', process.env.DEBUG_PHASER);
	}

	public start(): void {
		console.log('UIManagerPlugin:start', this);
		this.onResizeThrottled = throttle(this.onResize.bind(this), 500);

		this.unsubscribe = this.store.subscribe(this.syncGameWithUIState);
		this.syncGameWithUIState();

		em.on('phaser:view:mounted', () => {
			em.once('layout:transition:end', () => {
				this.onResize();
			});

			this.onResize();

			window.addEventListener('resize', this.onResizeThrottled);
		});

		em.on('phaser:view:dismounted', () => {
			window.removeEventListener('resize', this.onResizeThrottled);
		});
		// patch Phaser fullscreen capabilities to be able to react on mode changes triggered from outside of phaser
		this.game.scale.onFullScreenChange = () => {
			console.log('UIManagerPlugin:onFullScreenChange', this.game.scale.fullscreen);
			// if (!this.game.scale.fullscreen.active) {
			// 	this.game.scale.stopFullscreen();
			// } else {
			// 	this.game.scale.startFullscreen();
			// }
			this.onResize();
		};
	}

	public stop(): void {
		console.log('UIManagerPlugin:stop');
		this.unsubscribe();

		window.removeEventListener('resize', this.onResizeThrottled);
	}

	private onResize(): void {
		// secure against resizing executed when canvas is not ready for drawing
		requestAnimationFrame(() => {
			const { innerWidth, innerHeight } = window;
			// secure against resizing executed when canvas was already removed from DOM
			if (this.game.canvas.parentElement.clientWidth === 0 && this.game.canvas.parentElement.clientHeight === 0) {
				return;
			}
			console.log('UIManagerPlugin:onresize', innerWidth, innerHeight, this.game.scale.scaleMode, this.game);
			if (this.game.scale.scaleMode === Phaser.Scale.RESIZE) {
				// scaledown game view on screen downsizing

				this.game.canvas.width = '0';
				this.game.canvas.height = '0';
				const { clientWidth, clientHeight } = this.game.canvas.parentElement;
				console.log('Phaser:resize', { clientWidth, clientHeight });
				this.game.scale.setParentSize(clientWidth, clientHeight);
			}

			if (this.game.scale.scaleMode === Phaser.Scale.FIT) {
				const { clientWidth, clientHeight } = this.game.canvas.parentElement;
				console.log('Phaser:resize', { clientWidth, clientHeight });
			}

			if (this.game.scale.scaleMode === Phaser.Scale.NONE) {
				// TODO: extract as configuration option
				const scaler: string = 'cover-resize';

				this.game.scale.setParentSize(0, 0);
				this.game.scale.resize(0, 0);
				this.game.scale.setZoom(1);

				const { clientWidth, clientHeight } = this.game.canvas.parentElement;
				console.log('Phaser:resize', { clientWidth, clientHeight });

				switch (scaler) {
					case 'fit': {
						const { width, height } = this.game.config;

						const scaleX = clientWidth / width;
						const scaleY = clientHeight / height;

						const zoom = Math.min(scaleX, scaleY);
						const scale = Math.min(scaleX, scaleY) / zoom;

						this.game.scale.setParentSize(clientWidth, clientHeight);
						this.game.scale.resize(width * scale, height * scale);
						this.game.scale.setZoom(zoom);
						break;
					}
					case 'cover-constant': {
						const zoom = 1;

						this.game.scale.setParentSize(clientWidth, clientHeight);
						this.game.scale.resize(clientWidth, clientHeight);
						this.game.scale.setZoom(zoom);
						break;
					}
					case 'cover-resize': {
						const { width, height } = this.game.config;

						const scaleX = clientWidth / width;
						const scaleY = clientHeight / height;

						const zoom = Math.max(scaleX, scaleY);

						this.game.scale.setParentSize(clientWidth, clientHeight);
						this.game.scale.resize(clientWidth / zoom, clientHeight / zoom);
						this.game.scale.setZoom(zoom);
						break;
					}
				}
			}
		});
	}

	private syncGameWithUIState = () => {
		const state = this.store.getState();
		console.log('UIManagerPlugin:syncGameWithUIState', state);
		// TODO: remove phaser sound manager leftovers
		this.game.sound.mute = state.mute;
		this.game.sound.volume = state.volume;

		if (state.paused) {
			/** that probably should be pause @see https://github.com/photonstorm/phaser3-docs/issues/40 */
			this.game.loop.sleep();
			this.game.sound.mute = true;
		} else {
			this.game.loop.wake();
		}
	}
});
