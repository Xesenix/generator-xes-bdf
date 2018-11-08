import { createMuiTheme } from '@material-ui/core/styles';

export const appThemes = {
	light: createMuiTheme({
		typography: {
			htmlFontSize: 16,
		},
		palette: {
			type: 'light',
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
		},
	}),
	dark: createMuiTheme({
		typography: {
			htmlFontSize: 16,
		},
		palette: {
			type: 'dark',
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
		},
	}),
};
