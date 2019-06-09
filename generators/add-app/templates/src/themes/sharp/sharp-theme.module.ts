import { II18nTranslation } from 'lib/i18n';
import { IApplication } from 'lib/interfaces';
import { IAppTheme, IThemeBuilder, ThemeModule } from 'theme';

export class SharpThemeModule {
	public static register(app: IApplication) {
		ThemeModule.registerTheme(
			app,
			'sharp-theme-light',
			(__: II18nTranslation) => __('sharp-theme-light'),
			(createTheme: IThemeBuilder) => () =>
				import(/* webpackChunkName: "sharp-theme" */ './sharp-theme.styles')
					.then((module) => module.default(createTheme, {
						type: 'light',
					}) as IAppTheme),
		);

		ThemeModule.registerTheme(
			app,
			'sharp-theme-dark',
			(__: II18nTranslation) => __('sharp-theme-dark'),
			(createTheme: IThemeBuilder) => () =>
				import(/* webpackChunkName: "sharp-theme" */ './sharp-theme.styles')
					.then((module) => module.default(createTheme, {
						type: 'dark',
					}) as IAppTheme),
		);
	}
}
