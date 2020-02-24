import * as React from 'react';
import { hot } from 'react-hot-loader';

import { ILanguageSelectorViewProps, languageDIDecorator } from 'components/ui/language/decorator';
import { ILanguageDescriptor } from 'lib/i18n';

import { IMenuItemExternalProps } from '../menu';

interface IMenuLanguageSelectorExternalProps {
	MenuItem: React.ComponentType<IMenuItemExternalProps>;
}

type IMenuLanguageSelectorViewProps = IMenuLanguageSelectorExternalProps & ILanguageSelectorViewProps;

function LanguageSelectorComponent(props: IMenuLanguageSelectorViewProps) {
	const {
		// prettier-ignore
		__,
		availableLanguages,
		bindToStore,
		update,
		MenuItem,
	} = props;
	const { language } = bindToStore([
		// prettier-ignore
		'language',
	]);
	// tslint:disable:jsx-no-lambda
	return (
		<>
			{
				availableLanguages.map(({ locale, i18nShortLabel }: ILanguageDescriptor) => (
					<MenuItem
						// prettier-ignore
						active={language === locale}
						activeColor="secondary"
						color="default"
						key={locale}
						label={i18nShortLabel(__)}
						onClick={() => update(locale)}
					/>
				))
			}
		</>
	);
}

export default hot(module)(languageDIDecorator<IMenuLanguageSelectorExternalProps>(LanguageSelectorComponent));
