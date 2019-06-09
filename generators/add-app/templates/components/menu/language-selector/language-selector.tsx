import * as React from 'react';
import { hot } from 'react-hot-loader';

import { ILanguageSelectorViewProps, languageDIDecorator } from 'components/language/decorator';
import { IMenuItemExternalProps } from '../menu';

interface IMenuLanguageSelectorExternalProps {
	MenuItem: React.ComponentType<IMenuItemExternalProps>;
}

type IMenuLanguageSelectorViewProps = IMenuLanguageSelectorExternalProps & ILanguageSelectorViewProps;

function LanguageSelectorComponent(props: IMenuLanguageSelectorViewProps) {
	const {
		// prettier-ignore
		__,
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
			<MenuItem
				// prettier-ignore
				active={language === 'pl'}
				color="default"
				activeColor="secondary"
				onClick={() => update('pl')}
				label="PL"
			/>
			<MenuItem
				// prettier-ignore
				active={language === 'en'}
				color="default"
				activeColor="secondary"
				onClick={() => update('en')}
				label="EN"
			/>
		</>
	);
}

export default hot(module)(languageDIDecorator<IMenuLanguageSelectorExternalProps>(LanguageSelectorComponent));
