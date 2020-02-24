import { PaletteOptions } from '@material-ui/core/styles/createPalette';

import { IAppTheme, IAppThemeOptions } from 'theme';

export default (
	createTheme: (options: IAppThemeOptions) => IAppTheme,
	paletteConfig: PaletteOptions = {},
) => {
	const { breakpoints } = createTheme({});
	const styles: IAppThemeOptions = {
		typography: {
			htmlFontSize: 16,
			h1: {
				fontWeight: 'bold',
			},
		},
		palette: {
			secondary: {
				light: '#ffc000',
				main: '#e8a000',
				dark: '#d09000',
				contrastText: '#ffffff',
			},
			primary: {
				light: '#ff8000',
				main: '#c30000',
				dark: '#a00000',
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
		},
	};

	return createTheme(styles);
};
