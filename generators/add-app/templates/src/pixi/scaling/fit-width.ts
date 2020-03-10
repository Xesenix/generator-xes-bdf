import { Application } from '@pixi/app';

export function fitWidth(app: Application) {
	const element = app.view;

	element.style.width = '0px';
	element.style.height = '0px';

	if (element.parentElement) {
		const width = element.parentElement.clientWidth;

		element.style.width = width + 'px';
		element.style.height = Math.floor(app.screen.height / app.screen.width * width) + 'px';
	}
}
