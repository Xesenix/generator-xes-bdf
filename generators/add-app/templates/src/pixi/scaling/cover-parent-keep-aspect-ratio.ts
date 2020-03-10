import { Application } from '@pixi/app';

export function coverParentKeepAspectRatio(app: Application) {
	const element = app.view;

	element.style.width = '0px';
	element.style.height = '0px';

	console.log('scale', app, element);

	if (element.parentElement) {
		const { clientWidth, clientHeight } = element.parentElement;

		app.screen.width = clientWidth;
		app.screen.height = clientHeight;
		element.width = clientWidth;
		element.height = clientHeight;
		element.style.width = clientWidth + 'px';
		element.style.height = clientHeight + 'px';
	}
}
