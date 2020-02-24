import { interfaces } from 'inversify';
import { Store } from 'redux';

import { resolveDependencies } from 'lib/di';
import { ICreateSetAction } from 'lib/interfaces';
import { IThemeBuilder } from 'theme';

import {
	// prettier-ignore
	IAppTheme,
	IAppThemesDescriptors,
	IThemeState,
	ThemesNames,
} from './interfaces';

export function ThemeBootProvider({ container }: interfaces.Context) {
	const console: Console = container.get<Console>('debug:console');
	console.debug('ThemeBootProvider');

	return () => resolveDependencies(container, [
		// prettier-ignore
		'data-store:provider()',
		'theme:create-theme()',
	], async (
		// prettier-ignore
		store: Store<IThemeState, any>,
		createTheme: IThemeBuilder,
	) => {
		const { theme } = store.getState();
		console.debug('ThemeBootProvider:boot', theme);

		const loadTheme = await resolveDependencies(container, [
				// prettier-ignore
				'theme:theme-descriptors:provider()',
			], (
				themesDescriptors: IAppThemesDescriptors,
			) => (value: ThemesNames) => {
				const key = `theme:loaded:${value}`;

				if (!themesDescriptors[value]) {
					container.bind(key).toConstantValue(createTheme({}));
					console.warn(`ThemeBootProvider:error requested theme '${value}' doesn't exist.`);
				}

				if (container.isBound(key)) {
					return Promise.resolve(container.get<IAppTheme>(key));
				}

				return themesDescriptors[value].themeProvider().then((result: IAppTheme) => {
					if (!container.isBound(key)) {
						container.bind(key).toConstantValue(result);
					}

					return result;
				});
			});

		const createSetThemeAction = container.get<ICreateSetAction<ThemesNames>>('data-store:action:create:set-theme');
		const setTheme = (value: ThemesNames) => {
			loadTheme(value).then(() => {
				store.dispatch(createSetThemeAction(value));
			});
		};
		container.bind('ui:actions')
			.toConstantValue(setTheme)
			.whenTargetNamed('setTheme');

		return loadTheme(theme);
	});
}
