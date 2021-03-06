import { Application } from '@pixi/app';

export function fitParentKeepAspectRatio(app: Application) {
	const element = app.view;

	if (element.parentElement) {
		const { clientWidth, clientHeight } = element.parentElement;
		const scaleX = clientWidth / app.screen.width;
		const scaleY = clientHeight / app.screen.height;
		const scale = Math.min(scaleX, scaleY);
		const width = app.screen.width * scale;
		const height = app.screen.height * scale;

		element.style.width = Math.floor(width) + 'px';
		element.style.height = Math.floor(height) + 'px';
	}
}
