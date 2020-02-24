import { connectToInjector } from 'lib/di';
import { II18nTranslation, ILanguageDescriptor } from 'lib/i18n';
import { LanguageType } from 'lib/interfaces';

export interface ILanguageSelectorViewProps {
	__: II18nTranslation;
	bindToStore: (keys: (keyof ILanguageState)[]) => ILanguageState;
	availableLanguages: ILanguageDescriptor[];
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
	availableLanguages: {
		dependencies: ['i18n:available-languages'],
	},
	update: {
		dependencies: ['i18n:actions@setCurrentLanguage'],
		value: (setCurrentLanguage: (locale: LanguageType) => void) => Promise.resolve(setCurrentLanguage),
	},
});
