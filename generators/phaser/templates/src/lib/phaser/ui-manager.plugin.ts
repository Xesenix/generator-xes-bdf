import throttle from 'lodash-es/throttle';
import { Store } from 'redux';

import { createClassProvider } from 'lib/di';

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
export const UIManagerPluginProvider = createClassProvider('ui-manager-plugin', [
	// prettier-ignore
	'phaser:provider()',
	'data-store:provider()',
	'window',
	'debug:console:DEBUG_PHASER',
], (
	// prettier-ignore
	Phaser,
	store: Store,
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

	public start() {
		console.log('UIManagerPlugin:start', this);
		this.unsubscribe = this.store.subscribe(this.syncGameWithUIState);
		// patch Phaser fullscreen capabilities to be able to react on mode changes triggered from outside of phaser
		this.game.scale.onFullScreenChange = () => {
			console.log('UIManagerPlugin:onFullScreenChange', this.game.scale.fullscreen);
			if (!this.game.scale.fullscreen.active) {
				this.game.scale.stopFullscreen();
			} else {
				this.game.scale.startFullscreen();
			}
		};

		window.addEventListener('resize', throttle((event: Event) => this.scaleGameView(event.target as Window), 1000));

		this.syncGameWithUIState();
	}

	public stop() {
		console.log('UIManagerPlugin:stop');
		this.unsubscribe();
	}

	private scaleGameView({ innerWidth, innerHeight }) {
		console.log('UIManagerPlugin:onresize', innerWidth, innerHeight, this.game);
		if (this.scaleMode === Phaser.Scale.NONE) {
			this.game.scale.resize(Math.min(this.game.scale.width, innerWidth), Math.min(this.game.scale.height, innerHeight));
		} else {
			// scaledown game view on screen downsizing
			this.game.scale.setParentSize(0, 0);
			// recalculate available space
			this.game.scale.getParentBounds();
			this.game.scale.displaySize.setParent(this.game.scale.parentSize);
			this.game.scale.refresh();
		}
	}

	private syncGameWithUIState = () => {
		const state = this.store.getState();
		console.log('UIManagerPlugin:syncGameWithUIState', state);
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
