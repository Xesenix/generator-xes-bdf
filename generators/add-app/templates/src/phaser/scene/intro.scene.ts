import { createClassProvider } from 'lib/di';
import { __ } from 'lib/i18n';

// prettier-ignore
export const IntroSceneProvider = createClassProvider('intro-scene', [
	// prettier-ignore
	'phaser:provider()',
	'debug:console:DEBUG_PHASER',
], (
	// prettier-ignore
	Phaser,
	console: Console,
) => class IntroScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'intro',
		});
	}

	public preload(): void {
		console.log('IntroScene:preload');

		this.load.image('bg', 'assets/bg.png');
	}

	public create(): void {
		const bg = this.add.image(384, 150, 'bg');
		bg.setOrigin(0.5, 0.5);
	}

	public destroy(): void {
	}

	public update(time: number, delta: number): void {
	}
});
