import { IApplication, ICreateSetAction } from 'lib/interfaces';

import { createLanguageReadyAction, createSetLanguageAction, ICreateSetLanguageReadyAction, LanguageType } from './actions';
import { __ } from './i18n';
import { I18nProvider, II18nProvider } from './i18n.provider';

export class I18nModule {
	public static register(app: IApplication) {
		app.bind<I18nModule>('i18n:module').toConstantValue(new I18nModule(app));
		app.bind<II18nProvider>('i18n:provider').toProvider(I18nProvider);
		app.bind<(key: string) => string>('i18n:translate').toConstantValue(__);

		app.bind<ICreateSetAction<LanguageType>>('data-store:action:create:set-language').toConstantValue(createSetLanguageAction);
		app.bind<ICreateSetLanguageReadyAction>('data-store:action:create:set-language-ready').toConstantValue(createLanguageReadyAction);
	}

	constructor(
		// prettier-ignore
		private app: IApplication,
	) {}

	public boot = () => {
		return this.app.get<II18nProvider>('i18n:provider')();
	}
}
