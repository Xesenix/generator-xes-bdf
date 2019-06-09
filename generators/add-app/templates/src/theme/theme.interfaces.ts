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

export type ThemesNames = 'default' | 'light' | 'dark' | string;

export type IThemeProvider = () => Promise<IAppTheme>;


export interface IAppThemesProviders {
	[key: string]: IThemeProvider;
}

export type IAppThemesProvider = () => Promise<IAppThemesProviders>;

export interface IThemeState {
	theme: ThemesNames;
}

export type IThemeBuilder = (style: IAppThemeOptions) => IAppTheme;

export interface IAppThemeDescriptor {
	name: ThemesNames;
	localizedLabel: (__: II18nTranslation) => string;
	themeProvider: IThemeProvider;
}

export interface IAppThemesDescriptors {
	[key: string]: IAppThemeDescriptor;
}
