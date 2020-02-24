import { IApplication, IEventEmitter } from 'lib/interfaces';
import { IPreloadProgress, preload } from 'lib/preload';
import ServiceWorkerModule from 'lib/service-worker/service-worker.module';

import IEComponent from './app/ie';
import PreloadComponent from './app/preloader';

function runNotSupportedBrowserApp(root: HTMLElement) {
	root.innerHTML = '';
	root.appendChild(IEComponent());
}

async function runStyledPreloadApp({
	labelFormatter = (label: string) => label.replace(/(\.[a-z0-9]*)/, ''),
	loadApp,
	progressFormatter = (loaded: number, total: number) => total > 0 ? `${(100 * loaded / total).toFixed(0)}%` : `${loaded}`,
	root,
}: {
	labelFormatter?: (label: string) => string;
	loadApp: () => Promise<new (root: HTMLElement, document: Document, window: Window) => IApplication>,
	progressFormatter?: (loaded: number, total: number) => string;
	root: HTMLElement;
}) {
	const renderProgress = (progress: IPreloadProgress) => {
		root.innerHTML = '';
		root.appendChild(PreloadComponent(progress, progressFormatter, labelFormatter));
	};
	const clearPreload = preload(renderProgress, document);

	const AppModule = await loadApp();

	const app: IApplication = new AppModule(root, document, window);
	app.get<IEventEmitter>('event-manager').on('app:boot', clearPreload);

	return app.run();
}

window.addEventListener('load', () => {
	const root: HTMLElement = document.getElementById('app') || document.body;

	const oldIE = window.navigator.userAgent.indexOf('MSIE ') >= 0;
	const newIE = window.navigator.userAgent.indexOf('Trident/') >= 0;

	if (oldIE || newIE) {
		runNotSupportedBrowserApp(root);
	} else {
		runStyledPreloadApp({
			root,
			loadApp: async () => {
				await ServiceWorkerModule.run(window, console);
				return (await import(/* webpackChunkName: "app" */ './app/app.module') as any).default;
			},
		});
	}
});
