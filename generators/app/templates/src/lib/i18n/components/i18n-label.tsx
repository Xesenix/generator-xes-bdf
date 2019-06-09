import * as React from 'react';
import { hot } from 'react-hot-loader';

import { connectToInjector } from 'lib/di';
import { LanguageType } from 'lib/interfaces';

import { II18nLanguagesState, II18nTranslation } from '../i18n.interfaces';

/** Component public properties required to be provided by parent component. */
export interface II18nLabelExternalProps {
	render: (__: II18nTranslation) => string;
}

/** Internal component properties include properties injected via dependency injection. */
interface II18nLabelInternalProps {
	__: II18nTranslation;
	bindToStore: (keys: (keyof II18nLabelState)[]) => II18nLabelState;
}

/** Internal component state. */
interface II18nLabelState {
	/** required for interface updates after changing application language */
	language: LanguageType;
	/** required for interface updates after loading language */
	languages: II18nLanguagesState;
}

const diDecorator = connectToInjector<II18nLabelExternalProps, II18nLabelInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	bindToStore: {
		dependencies: ['data-store:bind'],
	},

});

type II18nLabelProps = II18nLabelExternalProps & II18nLabelInternalProps;

function I18nLabel(props: II18nLabelProps) {
	const {
		// prettier-ignore
		__,
		bindToStore,
		render,
	} = props;

	bindToStore([
		// prettier-ignore
		'language',
		'languages',
	]);

	return <>{render(__)}</>;
}

export default hot(module)(diDecorator(I18nLabel));
