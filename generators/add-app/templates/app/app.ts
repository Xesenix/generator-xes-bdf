import { Container } from 'inversify';

import { renderHtml } from 'lib/dom-helper';

export default (app: Container) => {
	console.log('<%= appTitle %>');
	const root = app.get<HTMLElement>('ui:root');
	root.innerHTML = '';
	root.appendChild(renderHtml({
		tag: 'h1',
		attributes: { class: 'app' },
		children: [
			`<%= appTitle %>`,
		],
	}));
}
