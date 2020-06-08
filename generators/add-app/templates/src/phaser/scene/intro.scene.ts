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
	private logo: Phaser.GameObjects.Image;

	constructor() {
		super({
			key: 'intro',
		});
	}

	public preload(): void {
		console.log('IntroScene:preload');

		this.load.image('logo', 'assets/thumb.png');
	}

	public create(): void {
		console.log('IntroScene:create', this);

		this.logo = this.add.image(this.game.config.width / 2 , this.game.config.height / 2 , 'logo');
		this.logo.setOrigin(0.5, 0.5);
	}

	public destroy(): void {
		console.log('IntroScene:destroy');

		if (this.logo) {
			this.logo.destroy();
			this.logo = null;
		}
	}

	public update(time: number, delta: number): void {
		const { width, height } = this.game.renderer;
		const speed = 140 / 60000;
		const scale = 0.75 - 0.25 * Math.sin(4 * 1000 / 60 * speed * Date.now() / 180 * Math.PI);

		this.logo.angle = 30 * Math.sin(time / 1000);
		this.logo.setScale(scale);
		this.logo.x = width * 0.5;
		this.logo.y = height * 0.5;
	}
});
