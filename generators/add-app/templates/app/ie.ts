import { renderHtml } from 'lib/dom-helper';

export default function IEComponent() {
	return renderHtml({
		key: '0',
		tag: 'h1',
		attributes: { class: 'ie' },
		children: [
			`Internet Explorer is not supported please use Chrome or Fire Fox`,
		],
	});
}
