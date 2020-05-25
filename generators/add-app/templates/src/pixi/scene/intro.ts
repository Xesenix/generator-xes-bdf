import { Sprite } from '@pixi/sprite';

import { inject } from 'lib/di';
import { BaseScene } from 'lib/pixi/scene/base';

const speed = 140 / 60000;

@inject([
	'pixi:application:provider',
])
export class IntroScene extends BaseScene {
	public name: string = 'intro';

	private sprite?: Sprite | null;

	private start: number = Date.now();


	protected preload() {
		if (this.app) {
			this.app.loader.add('logo', 'assets/thumb.png');
		}
	}

	protected build() {
		if (this.app) {
			const { width, height } = this.app.screen;
			this.app.renderer.backgroundColor = 0x340000;

			this.sprite = Sprite.from('logo');
			this.sprite.anchor.set(0.5);
			this.app.stage.addChild(this.sprite);

			this.sprite.x = width * 0.5;
			this.sprite.y = height * 0.5;
			this.sprite.anchor.set(0.5, 0.5);

			this.start = Date.now();
		}
	}

	protected destroy() {
		if (this.sprite) {
			if (this.app) {
				this.app.stage.removeChild(this.sprite);
			}
			this.sprite.destroy();
			this.sprite = null;
		}
	}

	protected update() {
		if (this.app) {
			const { width, height } = this.app.screen;
			const time = Date.now() - this.start;
			const scale = 0.75 - 0.25 * Math.sin(4 * 1000 / 60 * speed * time / 180 * Math.PI);

			if (this.sprite) {
				this.sprite.rotation = 30 * Math.sin(time / 1000) / 180 * Math.PI;
				this.sprite.scale.set(scale);

				this.sprite.x = width * 0.5;
				this.sprite.y = height * 0.5;
			}
		}
	}
}
