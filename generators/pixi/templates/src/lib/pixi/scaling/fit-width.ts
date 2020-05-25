import { Application } from '@pixi/app';

export function fitWidth(app: Application) {
	const element = app.view;

	if (element.parentElement) {
		const width = element.parentElement.clientWidth;

		element.style.width = width + 'px';
		element.style.height = Math.floor(app.screen.height / app.screen.width * width) + 'px';
	}
}
