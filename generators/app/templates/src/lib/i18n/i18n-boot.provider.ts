import { interfaces } from 'inversify';
import { Store } from 'redux';

import { IDataStoreProvider } from 'lib/data-store';
import { ICreateSetAction, LanguageType } from 'lib/interfaces';

import { ICreateSetLanguageReadyAction } from './actions';
import { i18n } from './i18n';

export type SetLanguageReadyActionType = (locale: LanguageType, value: boolean) => void;

/**
 * Update i18n object after each change in store language setup.
 * Also load translations if needed.
 */
const syncLocaleWithStore = (store: Store<any, any>, setLanguageReady: SetLanguageReadyActionType) => () => {
	const { language, languages } = store.getState();
	const localesPath = process.env.LOCALES_DIR;

	if (!!languages[language] && languages[language].ready) {
		i18n.setLocale(language);
		return Promise.resolve();
	}

	if (!localesPath) {
		return Promise.reject('ERROR localesPath not set in env LOCALES_DIR');
	}

	// This needs to be know at build time to prepare bundles with translations.
	return import(/* webpackChunkName: "locales-" */ `${process.env.LOCALES_DIR}/messages.${language}.po`).then(
		(content) => {
			i18n.addTranslations(language, 'messages', content);
			i18n.setLocale(language);
			setLanguageReady(language, true);
		},
		(err) => Promise.reject(`ERROR while loading locales path: '${localesPath}/messages.${language}.po'`),
	);
};

export function I18nBootProvider({ container }: interfaces.Context) {
	const console: Console = container.get<Console>('debug:console');
	console.debug('I18nBootProvider');

	return () => container
		.get<IDataStoreProvider<any, any>>('data-store:provider')()
		.then((store: Store<any, any>) => {
			console.debug('I18nBootProvider:boot');

			const createSetCurrentLanguageAction = container.get<ICreateSetAction<LanguageType>>('data-store:action:create:set-current-language');
			container.bind('i18n:actions')
				.toConstantValue((value: LanguageType) => store.dispatch(createSetCurrentLanguageAction(value)))
				.whenTargetNamed('setCurrentLanguage');

			const createSetLanguageReadyAction = container.get<ICreateSetLanguageReadyAction>('data-store:action:create:set-language-ready');
			const setLanguageReadyAction: SetLanguageReadyActionType = (locale: LanguageType, value: boolean) => store.dispatch(createSetLanguageReadyAction(locale, value));
			container.bind<SetLanguageReadyActionType>('i18n:actions')
				.toConstantValue(setLanguageReadyAction)
				.whenTargetNamed('setLanguageReady');

			const sync = syncLocaleWithStore(store, setLanguageReadyAction);
			store.subscribe(sync);

			return sync();
		});
}
