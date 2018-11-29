import { interfaces } from 'inversify-vanillajs-helpers';
import { Store } from 'redux';

import { IDataStoreProvider } from 'lib/data-store';
import { ICreateSetAction } from 'lib/interfaces';

import { ICreateSetLanguageReadyAction, LanguageType } from './actions';

export interface II18nActions {
	setCurrentLanguage: (value: LanguageType) => void;
	setLanguageReady: (locale: LanguageType, value: boolean) => void;
}

export type II18nActionsProvider = () => Promise<II18nActions>;

export function I18nActionsProvider(context: interfaces.Context) {
	return () =>
		context.container
			.get<IDataStoreProvider<any, any>>('data-store:provider')()
			.then((store: Store<any, any>) => {
				if (!context.container.isBound('i18n:actions')) {
					const createSetCurrentLanguageAction = context.container.get<ICreateSetAction<LanguageType>>('data-store:action:create:set-current-language');
					const createSetLanguageReadyAction = context.container.get<ICreateSetLanguageReadyAction>('data-store:action:create:set-language-ready');

					context.container.bind<II18nActions>('i18n:actions').toConstantValue({
						setCurrentLanguage: (value: LanguageType) => store.dispatch(createSetCurrentLanguageAction(value)),
						setLanguageReady: (locale: LanguageType, value: boolean) => store.dispatch(createSetLanguageReadyAction(locale, value)),
					});
				}

				return context.container.get<II18nActions>('i18n:actions');
			});
}
