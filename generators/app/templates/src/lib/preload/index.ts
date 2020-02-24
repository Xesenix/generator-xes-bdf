
export interface IPreloadProgress {
	[key: string]: {
		url: string;
		loaded: number;
		total: number;
	};
}

/**
 * Will handle preloading of modules split by webpack.
 * Requires chunk-progress-webpack-plugin to work.
 *
 * @param renderProgress function rendering preload view
 * @param root DOM node for rendering progress component
 */
export function preload(renderProgress: (progress: IPreloadProgress) => void, document: Document) {
	let animationFrameHandler;
	const progress: IPreloadProgress = {};

	function preloadProgress(event: any = {}) {
		const { detail = {} } = event;
		const { originalEvent = {}, resource = {} } = detail;
		const { target = null, lengthComputable = false } = originalEvent;

		const total = target
			? lengthComputable
				? parseInt(target.getResponseHeader('content-length'), 10)
				: parseInt(target.getResponseHeader('x-decompressed-content-length'), 10) || 0
			: 0;

		if (resource.url) {
			progress[resource.url] = Object.assign(progress[resource.url] || {}, resource, { total });
		}

		animationFrameHandler = requestAnimationFrame(() => {
			if (animationFrameHandler) {
				renderProgress(progress);
			}
		});
	}

	preloadProgress();

	document.addEventListener('chunk-progress-webpack-plugin', preloadProgress);

	return () => {
		document.removeEventListener('chunk-progress-webpack-plugin', preloadProgress);
		cancelAnimationFrame(animationFrameHandler);
		animationFrameHandler = null;
	};
}
