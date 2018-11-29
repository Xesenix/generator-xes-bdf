import {
	// prettier-ignore
	IApplication,
	ICreateSetAction,
} from 'lib/interfaces';

import {
	// prettier-ignore
	createLanguageReadyAction,
	createSetCurrentLanguageAction,
	ICreateSetLanguageReadyAction,
	LanguageType,
} from './actions';
import { __ } from './i18n';
import {
	// prettier-ignore
	I18nActionsProvider,
	II18nActionsProvider,
} from './i18n-actions.provider';
import {
	// prettier-ignore
	I18nProvider,
	II18nProvider,
} from './i18n.provider';

export class I18nModule {
	public static register(app: IApplication) {
		app.bind<I18nModule>('i18n:module').toConstantValue(new I18nModule(app));
		app.bind<II18nProvider>('i18n:provider').toProvider(I18nProvider);
		app.bind<(key: string) => string>('i18n:translate').toConstantValue(__);

		app.bind<II18nActionsProvider>('i18n:actions:provider').toProvider(I18nActionsProvider);

		app.bind<ICreateSetAction<LanguageType>>('data-store:action:create:set-current-language').toConstantValue(createSetCurrentLanguageAction);
		app.bind<ICreateSetLanguageReadyAction>('data-store:action:create:set-language-ready').toConstantValue(createLanguageReadyAction);
	}

	constructor(
		// prettier-ignore
		private app: IApplication,
	) {}

	public boot = () => {
		// TODO: consider creating provider for whole module
		return Promise.all([
			this.app
				.get<II18nProvider>('i18n:provider')()
				.then(this.app.get<II18nActionsProvider>('i18n:actions:provider')),
		]);
	}
}
