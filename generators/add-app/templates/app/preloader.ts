import { renderHtml } from 'lib/dom-helper';
import { IPreloadProgress } from 'lib/preload';

function PreloadComponent(
	// prettier-ignore
	progress: IPreloadProgress = {},
	progressFormater = (loaded: number, total: number) => `${loaded} / ${total}`,
	labelFormater = (label: string) => label,
) {
	const loaders = Object.entries(progress);
	return renderHtml({
		tag: 'div',
		attributes: { class: 'preload' },
		children: [
			{
				tag: 'div',
				attributes: { class: 'content' },
				children: [
					{ tag: 'img', attributes: { src: 'assets/thumb.png' } },
					{ tag: 'h1', children: ['Collecting tools'] },
					{ tag: 'h2', children: ['Please wait while application is loading'] },
					loaders.length > 0
						? {
							tag: 'div',
							attributes: { class: 'resources' },
							children: loaders.map(([key, { url, loaded, total }]) => [
									{ tag: 'span', key, attributes: { class: 'label' }, children: [labelFormater(url)] },
									{ tag: 'span', key, attributes: { class: 'progress' }, children: [progressFormater(loaded, total)] },
								]).reduce((r, a) => [...r, ...a]),
						}
						: null,
				],
			},
		],
	});
}

export default PreloadComponent;
