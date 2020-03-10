import { Application } from '@pixi/app';
import { Sprite } from '@pixi/sprite';

const speed = 140 / 60000;

function LoadScene(app: Application) {
	const sprite = Sprite.from('logo');
	sprite.anchor.set(0.5);
	app.stage.addChild(sprite);

	sprite.x = app.screen.width * 0.5;
	sprite.y = app.screen.height * 0.5;
	sprite.anchor.set(0.5, 0.5);

	const start = Date.now();

	app.ticker.add((delta) => {
		const time = Date.now() - start;
		const scale = 0.75 - 0.25 * Math.sin(4 * 1000 / 60 * speed * time / 180 * Math.PI);
		sprite.rotation = 30 * Math.sin(time / 1000) / 180 * Math.PI;
		sprite.scale.set(scale);

		sprite.x = app.screen.width * 0.5;
		sprite.y = app.screen.height * 0.5;
	});
}

export default function IntroScene(app: Application) {

	app.loader.load(() => LoadScene(app));
}
