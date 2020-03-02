import { Container } from 'inversify';

import { renderHtml } from 'lib/dom-helper';

import '../styles/app.scss';

export default (app: Container) => {
	console.log('<%= appTitle %>');
	const root = app.get<HTMLElement>('ui:root');
	root.innerHTML = '';
	root.appendChild(renderHtml({
		key: 0,
		tag: 'div',
		attributes: { class: '' },
		children: [
			{ key: 0, tag: 'img', attributes: { src: 'assets/thumb.png' } },
			{
				key: 1,
				tag: 'div',
				attributes: { class: 'content' },
				children: [
					{ key: 0, tag: 'h1', children: [`<%= appTitle %>`] },
					{ key: 1, tag: 'p', children: [`<%= appDescription %>`] },
				],
			},
		],
	}));
}
