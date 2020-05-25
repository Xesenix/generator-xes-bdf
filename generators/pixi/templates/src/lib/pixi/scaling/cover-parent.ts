import { Application } from '@pixi/app';

export function coverParent(app: Application) {
	const element = app.view;

	if (element.parentElement) {
		const { clientWidth, clientHeight } = element.parentElement;

		element.style.width = clientWidth + 'px';
		element.style.height = clientHeight + 'px';
	}
}
