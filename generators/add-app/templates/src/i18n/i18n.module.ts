import {
	II18nTranslation,
	ILanguageDescriptor,
} from 'lib/i18n';
import { IApplication, LanguageType } from 'lib/interfaces';

export default class I18nModule {
	public static register(app: IApplication) {
		const console = app.get<Console>('debug:console');
		console.log('I18nModule:register');

		app.bind<ILanguageDescriptor[]>('i18n:available-languages').toConstantValue([
			{
				i18nLabel: (__: II18nTranslation) => __('english'),
				i18nShortLabel: (__: II18nTranslation) => __('EN'),
				locale: 'en' as LanguageType,
			},
		]);
	}
}
