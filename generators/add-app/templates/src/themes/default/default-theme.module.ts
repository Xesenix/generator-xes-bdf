import { II18nTranslation } from 'lib/i18n';
import { IApplication } from 'lib/interfaces';
import { IAppTheme, IThemeBuilder } from 'theme';
import ThemeModule from 'theme/theme.module';

export default class DefaultThemeModule {
	public static register(app: IApplication) {
		const console = app.get<Console>('debug:console');
		console.log('DefaultThemeModule:register');

		ThemeModule.registerTheme(
			app,
			'default-theme-light',
			(__: II18nTranslation) => __('default-theme-light'),
			(createTheme: IThemeBuilder) => () =>
				import(/* webpackChunkName: "default-theme" */ './default-theme.styles')
					.then((module) => module.default(createTheme, {
						type: 'light',
					}) as IAppTheme),
		);

		ThemeModule.registerTheme(
			app,
			'default-theme-dark',
			(__: II18nTranslation) => __('default-theme-dark'),
			(createTheme: IThemeBuilder) => () =>
				import(/* webpackChunkName: "default-theme" */ './default-theme.styles')
					.then((module) => module.default(createTheme, {
						type: 'dark',
					}) as IAppTheme),
		);
	}
}
