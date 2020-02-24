export default class ServiceWorkerModule {
	public static run(window: Window, console: Console) {
		console.debug('ServiceWorkerModule', process.env.SERVICE_WORKER, window.navigator);
		if (process.env.SERVICE_WORKER === 'true' && 'serviceWorker' in window.navigator) {
			console.log('ServiceWorkerModule:service worker initialization');
			// Use the window load event to keep the page load performant
			return window.navigator.serviceWorker.register('./service-worker.js')
				.then(() => {
					console.log('ServiceWorkerModule:service worker ready');
				})
				.catch((err) => {
					console.log('ServiceWorkerModule:service worker error', err);
				});
		}

		console.log('ServiceWorkerModule:service worker unavailable');

		return Promise.resolve();
	}
}
