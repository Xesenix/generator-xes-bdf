import * as React from 'react';
import { hot } from 'react-hot-loader';

import { ILanguageDescriptor } from 'lib/i18n';
import { LanguageType } from 'lib/interfaces';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { ILanguageSelectorViewProps, languageDIDecorator } from '../decorator';

function LanguageSelectorComponent(props: ILanguageSelectorViewProps) {
	const {
		// prettier-ignore
		__,
		availableLanguages,
		bindToStore,
		update,
	} = props;
	const { language } = bindToStore([
		// prettier-ignore
		'language',
	]);
	// tslint:disable:jsx-no-lambda
	return (
		<Select
			onChange={(event) => update(event.target.value as any as LanguageType)}
			value={language}
		>
			{
				availableLanguages.map(({ locale, i18nLabel }: ILanguageDescriptor) => (
					<MenuItem key={locale} value={locale}>{i18nLabel(__)}</MenuItem>
				))
			}
		</Select>
	);
}

export default hot(module)(languageDIDecorator<{}>(LanguageSelectorComponent));
