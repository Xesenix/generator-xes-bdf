import { Application } from '@pixi/app';

export function coverParent(app: Application) {
	const element = app.view;

	element.style.width = '0px';
	element.style.height = '0px';

	console.log('scale', element);

	if (element.parentElement) {
		const { clientWidth, clientHeight } = element.parentElement;

		element.style.width = clientWidth + 'px';
		element.style.height = clientHeight + 'px';
	}
}
