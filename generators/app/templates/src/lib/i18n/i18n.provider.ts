import { interfaces } from 'inversify';
import { Gettext } from 'node-gettext';
import { Store } from 'redux';

import { IDataStoreProvider } from 'lib/data-store/data-store.provider';

import { i18n } from './i18n';
import {
	// prettier-ignore
	II18nActions,
	II18nActionsProvider,
} from './i18n-actions.provider';

/**
 * Update i18n object after each change in store language setup.
 * Also load translations if needed.
 */
const syncLocaleWithStore = (store: Store<any, any>, actions: II18nActions) => () => {
	return new Promise((resolve, reject) => {
		const { language, languages } = store.getState();
		const localesPath = process.env.LOCALES_DIR;
		if (!languages[language].ready) {
			if (localesPath) {
				// This needs to be know at build time to prepare bundles with translations.
				import(`${process.env.LOCALES_DIR}/messages.${language}.po`).then(
					(content) => {
						i18n.addTranslations(language, 'messages', content);
						i18n.setLocale(language);
						actions.setLanguageReady(language, true);
						resolve();
					},
					(err) => reject(`ERROR while loading locales path: '${localesPath}/messages.${language}.po'`),
				);
			} else {
				reject('ERROR localesPath not set in env LOCALES_DIR');
			}
		} else {
			i18n.setLocale(language);
			resolve();
		}
	});
};

export type II18nProvider = () => Promise<Gettext>;

/**
 * Listens to application boot and then connects to data store to react to changes in current language.
 */
export function I18nProvider(context: interfaces.Context) {
	const console: Console = context.container.get<Console>('debug:console');
	console.debug('I18nProvider');

	return () =>
		new Promise((resolve, reject) => {
			try {
				const storeProvider = context.container.get<IDataStoreProvider<any, any>>('data-store:provider');
				const actionsProvider = context.container.get<II18nActionsProvider>('i18n:actions:provider');
				return Promise.all([
					// prettier-ignore
					storeProvider(),
					actionsProvider(),
				]).then(([store, actions]: [Store<any, any>, II18nActions]) => {
					store.subscribe(syncLocaleWithStore(store, actions));
					return syncLocaleWithStore(store, actions)().then(() => {
						resolve(i18n);
					});
				});
			} catch (error) {
				return reject(error);
			}
		});
}
