import * as React from 'react';
import { hot } from 'react-hot-loader';

import './report-container.scss';

function ReportContainerComponent({ app }) {
	const dictionary: [string, any[]][] = Array.from(
		((app as any)._bindingDictionary.getMap().entries() as [string, any[]][]),
	).sort(([a], [b]) => a > b ? 1 : -1);
	const phraseRef = React.useRef<HTMLInputElement>(null);
	const typeRef = React.useRef<HTMLInputElement>(null);
	const [ phrase = '', setPhrase ] = React.useState<string>('');
	const [ type = '', setType ] = React.useState<string>('');
	const search = React.useCallback(() => {
		setPhrase((phraseRef && phraseRef.current ? phraseRef.current.value || '' : '').toLowerCase());
		setType((typeRef && typeRef.current ? typeRef.current.value || '' : '').toLowerCase());
	}, [setPhrase, setType]);
	const filter = React.useCallback(([ key, bind ]) =>
		(phrase.length === 0 || key.toLowerCase().indexOf(phrase) >= 0) &&
		(type.length === 0 || bind[0].type.toLowerCase().indexOf(type) >= 0),
		[phrase, type],
	);

	return (
		<table>
			<caption>Dependency Injection Container</caption>
			<thead>
				<tr>
					<th><input ref={phraseRef} onKeyUp={search}/></th>
					<th><input ref={typeRef} onKeyUp={search}/></th>
				</tr>
			</thead>
			<tbody>
			{
				dictionary.filter(filter).map(([ key, bind ]) => (
					<tr key={key}>
						<th>{ key }</th>
						<td>{ bind[0].type }[{ bind.length }]</td>
					</tr>
				))
			}
			</tbody>
		</table>
	);
}

export default hot(module)(ReportContainerComponent);
