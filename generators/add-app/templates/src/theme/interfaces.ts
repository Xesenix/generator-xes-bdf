import * as React from 'react';

import { Theme } from '@material-ui/core';
import { FabClassKey } from '@material-ui/core/Fab';
import { StyleRules } from '@material-ui/core/styles';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { Overrides } from '@material-ui/core/styles/overrides';
import { II18nTranslation } from 'lib/i18n';

export interface ICSSProperties {
	[propertyName: string]: any;
}

export interface IAppThemeOptions extends ThemeOptions {
	layout?: {
		primary?: {
			root?: ICSSProperties;
		},
		fullscreen?: {
			root?: ICSSProperties;
		},
		container?: {
			wrapper?: ICSSProperties;
		};
		toolbarHeight?: any;
	};

	icons?: {
		config?: React.ComponentType;
		undo?: React.ComponentType;
		fullscreenOn?: React.ComponentType;
		fullscreenOff?: React.ComponentType;
		muteOn?: React.ComponentType;
		muteOff?: React.ComponentType;
		musicOff?: React.ComponentType;
		musicOn?: React.ComponentType;
		soundOff?: React.ComponentType;
		soundOn?: React.ComponentType;
	};

	overrides?: Overrides & {
		DrawerMenuButton?: Partial<StyleRules<FabClassKey>>;
		TopMenuButton?: Partial<StyleRules<FabClassKey>>;
		topToolbar?: ICSSProperties;
	};
}

/**
 * Set of configurations used for styling application.
 */
export interface IAppTheme extends Theme {
	layout: {
		primary: {
			root: ICSSProperties;
		},
		fullscreen: {
			root: ICSSProperties;
		},
		container: {
			wrapper: ICSSProperties;
		};
		toolbarHeight: any;
	};

	icons: {
		config: React.ComponentType;
		undo: React.ComponentType;
		fullscreenOn: React.ComponentType;
		fullscreenOff: React.ComponentType;
		muteOn: React.ComponentType;
		muteOff: React.ComponentType;
		musicOff: React.ComponentType;
		musicOn: React.ComponentType;
		soundOff: React.ComponentType;
		soundOn: React.ComponentType;
	};

	overrides: Overrides & {
		DrawerMenuButton: Partial<StyleRules<FabClassKey>>;
		TopMenuButton: Partial<StyleRules<FabClassKey>>;
		topToolbar: ICSSProperties;
	};
}

/**
 * Key used to identify theme.
 * @see IAppThemesProviders
 * @see IAppThemesDescriptors
 */
export type ThemesNames = 'default-theme-light' | 'default-theme-dark' | keyof(IAppThemesProviders);

/**
 * Asynchronously loads configuration for theme and assets required for particular theme.
 */
export type IThemeProvider = () => Promise<IAppTheme>;

/**
 * Set of all available application themes descriptors providers.
 */
export interface IAppThemesProviders {
	[key: string]: IThemeProvider;
}

/**
 * Datastore state describing currently used theme.
 */
export interface IThemeState {
	/** Name of theme currently used by application. */
	theme: ThemesNames;
}

/**
 * Function returning theme configuration.
 */
export type IThemeBuilder = (style: IAppThemeOptions) => IAppTheme;

/**
 * Interface describing application theme.
 */
export interface IAppThemeDescriptor {
	/** Theme name. */
	name: ThemesNames;
	/**
	 * Function injected with translation function that can be used
	 * to translate theme name to version readable to end users use
	 * `__` for translation argument name so it can be extracted.
	 */
	localizedLabel: (__: II18nTranslation) => string;
	/** Provider used for loading theme. */
	themeProvider: IThemeProvider;
}

/**
 * Set of all available application themes descriptors.
 */
export interface IAppThemesDescriptors {
	[key: string]: IAppThemeDescriptor;
}
