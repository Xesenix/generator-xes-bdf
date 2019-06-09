import { Reducer } from 'redux';

import {
	// prettier-ignore
	IApplication,
	ICreateSetAction,
	LanguageType,
} from 'lib/interfaces';

import {
	// prettier-ignore
	createLanguageReadyAction,
	createSetCurrentLanguageAction,
	ICreateSetLanguageReadyAction,
} from './actions';
import { _$, __ } from './i18n';
import { I18nBootProvider } from './i18n-boot.provider';
import {
	// prettier-ignore
	II18nPluralTranslation,
	II18nTranslation,
} from './i18n.interfaces';
import { reducer } from './reducers/index';

export class I18nModule {
	public static register(app: IApplication) {

		// define logic needed to bootstrap module
		app.bind('boot').toProvider(I18nBootProvider);

		app.bind<II18nTranslation>('i18n:translate').toConstantValue(__);
		app.bind<II18nPluralTranslation>('i18n:translate_plural').toConstantValue(_$);

		app.bind<ICreateSetAction<LanguageType>>('data-store:action:create:set-current-language').toConstantValue(createSetCurrentLanguageAction);
		app.bind<ICreateSetLanguageReadyAction>('data-store:action:create:set-language-ready').toConstantValue(createLanguageReadyAction);

		// add data store keys that should be persisted between page refresh
		app.bind<string>('data-store:persist:state').toConstantValue('language');

		// add reducer from this module
		app.bind<Reducer<any, any>>('data-store:reducers').toConstantValue(reducer);
	}
}
