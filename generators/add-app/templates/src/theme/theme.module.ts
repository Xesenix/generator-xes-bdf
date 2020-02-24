import { interfaces } from 'inversify';
import { Reducer, Store } from 'redux';

import { resolveDependencies } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';
import { IApplication, ICreateSetAction } from 'lib/interfaces';

import { createSetThemeAction } from './actions';
import {
	// prettier-ignore
	IAppTheme,
	IAppThemeDescriptor,
	IAppThemesDescriptors,
	IThemeBuilder,
	IThemeProvider,
	IThemeState,
	ThemesNames,
} from './interfaces';
import { reducer } from './reducers';
import { ThemeBootProvider } from './theme-boot.provider';

export default class ThemeModule {
	public static register(app: IApplication) {
		const console = app.get<Console>('debug:console');
		console.log('ThemeModule:register');

		// define logic needed to bootstrap module
		app.bind('boot').toProvider(ThemeBootProvider);
		app.bind<IThemeBuilder>('theme:create-theme')
			.toProvider(() => () =>
				import(/* webpackChunkName: "theme" */ './create-theme')
					.then(({ createAppTheme }) => createAppTheme),
			);

		app.bind<Promise<IAppThemesDescriptors>>('theme:theme-descriptors:provider')
			.toProvider(({ container }: interfaces.Context) => () => resolveDependencies<IAppThemesDescriptors>(container, [
				'theme:theme:provider[]()',
			], (
				themeDescriptors,
			) => themeDescriptors
				.reduce(
					(
						result: Partial<IAppThemesDescriptors>,
						{ name, ...data },
					) => ({
						...result,
						[name]: data,
					}),
					{},
				),
		));

		// current application theme
		app.bind<Promise<() => IAppTheme>>('theme:get-theme')
			.toProvider(({ container }: interfaces.Context) => () => resolveDependencies<() => IAppTheme>(container, [
				'data-store',
				'theme:create-theme()',
			], (
				store: Store<IThemeState, any>,
				createTheme: IThemeBuilder,
			) => () => {
				const { theme } = store.getState();
				const key = `theme:loaded:${theme}`;
				if (!container.isBound(key)) {
					console.warn(`ThemeModule:error theme ${theme} is not loaded.\nEnsure that theme is loaded before setting it in data store.`);
					container.bind<IAppTheme>(key).toConstantValue(createTheme({}));
				}
				return container.get<IAppTheme>(key);
			}));

		// redux action creators
		app.bind<ICreateSetAction<ThemesNames>>('data-store:action:create:set-theme').toConstantValue(createSetThemeAction);

		// add data store keys that should be persisted between page refresh
		app.bind<string>('data-store:persist:state').toConstantValue('theme');

		// add reducer from this module
		app.bind<Reducer<any, any>>('data-store:reducers').toConstantValue(reducer);
	}

	/**
	 * Used to streamline adding new application styling themes.
	 *
	 * @param app application container on which dependencies will be defined
	 * @param name name used for identify theme should be unique
	 * @param localizedLabel function returning label used to identify theme to user
	 * injected with translation method that can be used for extracting label for
	 * translation needs to be named `__`
	 * @param themeProviderFactory factory function injected with createTheme used
	 * as base for creating theme configuration returning theme provider can also be used
	 * to split themes as separate modules and load additional assets only if theme is used
	 */
	public static registerTheme(
		// prettier-ignore
		app: IApplication,
		name: string,
		localizedLabel: (__: II18nTranslation) => string,
		themeProviderFactory: (builder: IThemeBuilder) => IThemeProvider,
	) {
		app.bind<Promise<IAppThemeDescriptor>>('theme:theme:provider')
			.toProvider(({ container }: interfaces.Context) => () => resolveDependencies<IAppThemeDescriptor>(container, [
				'theme:create-theme()',
			], (
				createTheme: IThemeBuilder,
			) => ({
				name,
				localizedLabel,
				themeProvider: themeProviderFactory(createTheme),
			})));
	}
}
