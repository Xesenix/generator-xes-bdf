import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';
import { LanguageType } from 'lib/interfaces';

export interface ILanguageSelectorViewProps {
	__: II18nTranslation;
	bindToStore: (keys: (keyof ILanguageState)[]) => ILanguageState;
	update: (value: LanguageType) => void;
}

interface ILanguageState {
	language: LanguageType;
}

export const languageDIDecorator = connectToInjector<{}, ILanguageSelectorViewProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	bindToStore: {
		dependencies: ['data-store:bind'],
	},
	update: {
		dependencies: ['i18n:actions@setCurrentLanguage'],
		value: (setCurrentLanguage: (locale: LanguageType) => void) => Promise.resolve(setCurrentLanguage),
	},
});
