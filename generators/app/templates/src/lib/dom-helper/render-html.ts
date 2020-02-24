const cached = {

};

interface IElementDescriptor {
	tag: string;
	key?: string;
	attributes?: { [key: string]: string };
	children?: (IElementDescriptor | string | null)[];
}

export function renderHtml({ tag, key, attributes = {}, children = [] }: IElementDescriptor) {
	const nodes = children.filter((child) => child !== null) as (IElementDescriptor | string)[];
	const cacheKey = JSON.stringify({
		tag,
		key,
		attributes,
		children: nodes.map((child, index) => ({
			key: typeof child === 'object' && !!child.key ? `node(${child.key})` : index,
		})),
	});
	const el = !cached[cacheKey] ? document.createElement(tag) : cached[cacheKey];

	Object.entries(attributes).forEach(([attr, value]) => {
		if (el.getAttribute(attr) !== value) {
			el.setAttribute(attr, value);
		}
	});

	if (nodes.length > 0) {
		nodes.forEach((child, index) => {
			const node = el.childNodes[index];
			if (!node) {
				if (typeof child === 'string') {
					el.appendChild(document.createTextNode(child));
				} else {
					el.appendChild(renderHtml(child));
				}
			} else {
				if (typeof child === 'string') {
					if (node.textContent !== child) {
						node.textContent = child;
					}
				} else {
					const newNode = renderHtml(child);
					if (newNode !== node) {
						el.replaceChild(newNode, node);
					}
				}
			}
		});
	}

	cached[cacheKey] = el;

	return el;
}
