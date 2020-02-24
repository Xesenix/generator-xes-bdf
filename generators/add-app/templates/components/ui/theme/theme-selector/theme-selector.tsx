import * as React from 'react';
import { hot } from 'react-hot-loader';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import I18nLabel from 'lib/i18n/components/i18n-label';
import { IAppThemeDescriptor } from 'theme';

import { IThemeSelectorViewProps, themeDIDecorator } from '../decorator';

function ThemeSelectorComponent(props: IThemeSelectorViewProps) {
	const {
		// prettier-ignore
		items,
		bindToStore,
		update,
	} = props;
	const { theme } = bindToStore([
		// prettier-ignore
		'theme',
	]);

	const onChange = React.useCallback((event) => update(event.target.value as string), [update]);

	// tslint:disable:jsx-no-lambda
	return (
		<Select
			onChange={onChange}
			value={theme}
		>
			{
				Object.entries<IAppThemeDescriptor>(items)
					.map(([key, { localizedLabel }]) => (
						<MenuItem key={key} value={key}><I18nLabel render={localizedLabel}/></MenuItem>
					))
			}
		</Select>
	);
}

export default hot(module)(themeDIDecorator<{}>(ThemeSelectorComponent));
