import { PaletteOptions } from '@material-ui/core/styles/createPalette';
import { IAppTheme, IAppThemeOptions } from 'theme';

export default (
	createTheme: (options: IAppThemeOptions) => IAppTheme,
	paletteConfig: PaletteOptions = {},
) => {
	const toolbarHeight = '48px';
	const styles: IAppThemeOptions = {
		typography: {
			htmlFontSize: 16,
			useNextVariants: true,
		},
		palette: {
			secondary: {
				light: '#ff00d0',
				main: '#d000a0',
				dark: '#a00080',
				contrastText: '#ffffff',
			},
			primary: {
				light: '#a040c3',
				main: '#8030a0',
				dark: '#602080',
				contrastText: '#ffffff',
			},
			...paletteConfig,
		},
		layout: {
			container: {
				wrapper: {
					maxWidth: '1200px',
				},
			},
			toolbarHeight,
		},
		overrides: {
			MuiToolbar: {
				root: {

				},
			},
			TopMenuButton: {
				root: {
					borderRadius: '0',
				},
			},
		},
		props: {
			MuiToolbar: {
				variant: 'dense',
				disableGutters: true,
			},
			MuiDrawer: {
				anchor: 'right',
			},
		},
	};

	return createTheme(styles);
};
