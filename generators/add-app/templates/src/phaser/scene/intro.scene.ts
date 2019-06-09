import { createClassProvider } from 'lib/di';
import { __ } from 'lib/i18n';
import { IEventEmitter } from 'lib/interfaces';
import { IAudioManager } from 'lib/sound';
import { ISoundtrackManager } from 'lib/sound-scape';
import { ISoundtrack } from 'lib/sound-scape/interfaces';

const note140 = 240 / 140;

const ambient: ISoundtrack = {
	key: 'soundtrack',
	name: 'ambient',
	intro: {
		start: note140 * 0,
		end: note140 * 0,
		duration: note140 * 0,
	},
	loop: {
		start: note140 * 0,
		end: note140 * 56,
		duration: note140 * 56,
		interruptionStep: note140 * 2,
	},
	outro: {
		start: note140 * 0,
		end: note140 * 0,
		duration: note140 * 0,
	},
};

const action: ISoundtrack = {
	key: 'soundtrack',
	name: 'action',
	intro: {
		start: note140 * 56,
		end: note140 * 60,
		duration: note140 * 4,
	},
	loop: {
		start: note140 * 60,
		end: note140 * 88,
		duration: note140 * 28,
		interruptionStep: note140 * 4,
	},
	outro: {
		start: note140 * 88,
		end: note140 * 92,
		duration: note140 * 4,
	},
};

// prettier-ignore
export const IntroSceneProvider = createClassProvider('intro-scene', [
	// prettier-ignore
	'phaser:provider()',
	'event-manager',
	'debug:console:DEBUG_PHASER',
], (
	// prettier-ignore
	Phaser,
	em: IEventEmitter,
	console: Console,
) => class IntroScene extends Phaser.Scene {
	private soundtrack?: Phaser.Sound.BaseSound;
	private label?: Phaser.GameObjects.Text;

	private mode: 'idle' | 'action' = 'idle';
	private sm?: IAudioManager;
	private stm?: ISoundtrackManager;

	constructor() {
		super({
			key: 'intro',
		});
	}

	public preload(): void {
		this.sm = this.sys.plugins.get('audio-manager') as any;
		this.stm = this.sys.plugins.get('soundtrack-manager') as any;
		console.log('IntroScene:preload');
		// TODO: use scene plugin
		if (!!(this.sm as any).setLoader) {
			(this.sm as any).setLoader(this.load);
		}

		if (this.sm) {
			this.sm.preloadAudioAsset('soundtrack', 'assets/soundtrack.ogg');
		}
		this.load.image('bg', 'assets/bg.png');
	}

	public create(): void {
		this.setupSoundTrack();

		const bg = this.add.image(384, 150, 'bg');
		bg.setOrigin(0.5, 0.5);

		// this.label = this.add.text(400, 20, '', { font: '24px Consolas', fill: '#ffffff' });
		// this.label.setOrigin(0.5, 0.0);

		em.on('mode:change', (mode: 'idle' | 'action') => {
			if (mode !== this.mode) {
				if (mode === 'action') {
					this.enterActionMode();
				} else {
					this.enterIdleMode();
				}
			}
		});
	}

	public destroy(): void {
		if (this.soundtrack) {
			this.soundtrack.destroy();
		}
	}

	public update(time: number, delta: number): void {
		if (this.label && this.stm && this.sm) {
			const currentSoundtrack = this.stm.soundtrackPlayer
				.getCurrentScheduledSoundtrack()
				.map(({ soundtrack: { name }, state, start, end }) => `${name}-${state}[${start.toFixed(2)}-${(end && end.toFixed(2)) || 'inf'}]`)
				.join(', ');

			this.label.setText(
				`${__('total time')}: ${(time / 1000).toFixed(0)}s\n
${__('delta time')}: ${delta.toFixed(2)}ms\n
${__('audio time')}: ${this.sm.context.currentTime.toFixed(2)}s\n
current sound: ${currentSoundtrack}`,
			);
		}
	}

	private enterIdleMode() {
		if (this.mode !== 'idle' && this.stm) {
			this.stm.soundtrackPlayer.scheduleNext(ambient, 0);
			this.mode = 'idle';
		}
	}

	private enterActionMode() {
		if (this.mode !== 'action' && this.stm && this.sm) {
			this.stm.soundtrackPlayer.scheduleNext(action, 0);
			this.idleTimeout = this.sm.context.currentTime + note140 * 16;
			this.mode = 'action';
		}
	}

	private setupSoundTrack() {
		if (this.sm) {
			this.idleTimeout = this.sm.context.currentTime;

			this.sm.preload().then(() => {
				if (this.stm) {
					this.stm.soundtrackPlayer.scheduleAfterLast(ambient, 0);
				}
			});
		}
	}
});
