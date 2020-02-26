import { Container } from 'inversify';

import { renderHtml } from 'lib/dom-helper';

import '../styles/app.scss';

export default (app: Container) => {
	console.log('<%= appTitle %>');
	const root = app.get<HTMLElement>('ui:root');
	root.innerHTML = '';
	root.appendChild(renderHtml({
		tag: 'h1',
		attributes: { class: 'app' },
		children: [
			{ tag: 'img', attributes: { src: 'assets/thumb.png' } },
			{ tag: 'h1', children: [`<%= appTitle %>`] },
			{ tag: 'p', children: [`<%= appDescription %>`] },
		],
	}));
}
