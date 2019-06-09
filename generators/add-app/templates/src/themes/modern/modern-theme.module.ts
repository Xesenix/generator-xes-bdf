import { II18nTranslation } from 'lib/i18n';
import { IApplication } from 'lib/interfaces';
import { IAppTheme, IThemeBuilder, ThemeModule } from 'theme';

export class ModernThemeModule {
	public static register(app: IApplication) {
		ThemeModule.registerTheme(
			app,
			'modern-theme-light',
			(__: II18nTranslation) => __('modern-theme-light'),
			(createTheme: IThemeBuilder) => () =>
				import(/* webpackChunkName: "modern-theme" */ './modern-theme.styles')
					.then((module) => module.default(createTheme, {
						type: 'light',
						background: {
							paper: '#eeeeee',
						},
					}) as IAppTheme),
		);

		ThemeModule.registerTheme(
			app,
			'modern-theme-dark',
			(__: II18nTranslation) => __('modern-theme-dark'),
			(createTheme: IThemeBuilder) => () =>
				import(/* webpackChunkName: "modern-theme" */ './modern-theme.styles')
					.then((module) => module.default(createTheme, {
						type: 'dark',
					}) as IAppTheme),
		);

		ThemeModule.registerTheme(
			app,
			'modern-theme-dark-0',
			(__: II18nTranslation) => __('modern-theme-dark-0'),
			(createTheme: IThemeBuilder) => () =>
				import(/* webpackChunkName: "modern-theme" */ './modern-theme.styles')
					.then((module) => module.default(createTheme, {
						type: 'dark',
						primary: {
							main: '#40a050',
							contrastText: '#ffffff',
						},
						secondary: {
							main: '#ffffff',
							contrastText: '#000000',
						},
					}) as IAppTheme),
		);

		ThemeModule.registerTheme(
			app,
			'modern-theme-light-0',
			(__: II18nTranslation) => __('modern-theme-light-0'),
			(createTheme: IThemeBuilder) => () =>
				import(/* webpackChunkName: "modern-theme" */ './modern-theme.styles')
					.then((module) => module.default(createTheme, {
						type: 'light',
						background: {
							paper: '#eeeeee',
						},
						primary: {
							main: '#40a050',
							contrastText: '#ffffff',
						},
						secondary: {
							main: '#000000',
							contrastText: '#ffffff',
						},
					}) as IAppTheme),
		);

		ThemeModule.registerTheme(
			app,
			'modern-theme-dark-1',
			(__: II18nTranslation) => __('modern-theme-dark-1'),
			(createTheme: IThemeBuilder) => () =>
				import(/* webpackChunkName: "modern-theme" */ './modern-theme.styles')
					.then((module) => module.default(createTheme, {
						type: 'dark',
						primary: {
							main: '#ffffff',
							contrastText: '#000000',
						},
						secondary: {
							main: '#40a050',
							contrastText: '#ffffff',
						},
					}) as IAppTheme),
		);

		ThemeModule.registerTheme(
			app,
			'modern-theme-light-1',
			(__: II18nTranslation) => __('modern-theme-light-1'),
			(createTheme: IThemeBuilder) => () =>
				import(/* webpackChunkName: "modern-theme" */ './modern-theme.styles')
					.then((module) => module.default(createTheme, {
						type: 'light',
						background: {
							paper: '#eeeeee',
						},
						primary: {
							main: '#222222',
							contrastText: '#ffffff',
						},
						secondary: {
							main: '#40a050',
							contrastText: '#ffffff',
						},
					}) as IAppTheme),
		);
	}
}
