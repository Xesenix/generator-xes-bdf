import { PaletteOptions } from '@material-ui/core/styles/createPalette';
import { darken, invert, lighten, linearGradient, radialGradient, rgba } from 'polished';
import { IAppTheme, IAppThemeOptions } from 'theme';

// icons
import UndoIcon from '@material-ui/icons/Close';
import SoundOnIcon from '@material-ui/icons/Grade';
import ConfigIcon from '@material-ui/icons/Settings';
import { Color } from 'csstype';

export default (
	createTheme: (options: IAppThemeOptions) => IAppTheme,
	paletteConfig: PaletteOptions = {},
) => {
	const toolbarHeight = '48px';
	const colorDefault = {
		light: '#aaaaaa',
		main: '#333333',
		dark: '#000000',
		contrastText: '#ffffff',
	};

	const { palette, breakpoints } = createTheme({
		palette: {
			secondary: {
				main: '#a00000',
				contrastText: '#ffffff',
			},
			primary: {
				main: '#3045ee',
				contrastText: '#ffffff',
			},
			...paletteConfig,
		},
	});

	const gridBackgroundImagePattern = (color: Color, bgColor: Color, size = 8) => ({
		backgroundImage: [
			linearGradient({
				colorStops: [
					`${color} 25%`,
					`transparent 25%`,
				],
				toDirection: '45deg',
			}).backgroundImage,
			linearGradient({
				colorStops: [
					`transparent 75%`,
					`${color} 75%`,
				],
				toDirection: '45deg',
			}).backgroundImage,
			linearGradient({
				colorStops: [
					`${color} 25%`,
					`transparent 25%`,
				],
				toDirection: '-45deg',
			}).backgroundImage,
			linearGradient({
				colorStops: [
					`transparent 75%`,
					`${color} 75%`,
				],
				toDirection: '-45deg',
			}).backgroundImage,
			radialGradient({
				colorStops: [
					'transparent 0%',
					`${rgba(bgColor, 0.1)} 40%`,
					`${rgba(bgColor, 0.6)} 80%`,
					`${rgba(bgColor, 0.8)} 100%`,
				],
				extent: 'ellipse at 0% 5%',
			}).backgroundImage,
		].join(', '),
		backgroundSize: [
			`${size}px ${size}px`,
			`${size}px ${size}px`,
			`${size}px ${size}px`,
			`${size}px ${size}px`,
			'200% 100%',
		].join(', '),
		backgroundPosition: [
			`0px 0px`,
			`${size / 2}px ${size / 2}px`,
			`0px ${size / 2}px`,
			`${size / 2}px 0px`,
			'0',
		].join(', '),
	});

	const inverseTheme = palette.type === 'dark';

	const backGroundColor = !inverseTheme ? lighten(0.6, palette.background.paper) : lighten(0.3, palette.background.paper);

	const darkBgPattern = gridBackgroundImagePattern(
		rgba(lighten(0.3, colorDefault.main), 0.15),
		colorDefault.main,
		32,
	);
	const paperPattern = gridBackgroundImagePattern(
		rgba(!inverseTheme ? lighten(0.3, colorDefault.light) : colorDefault.main, 0.55),
		colorDefault.light,
		8,
	);

	const toolbarGradient = (color: Color, emboss: boolean = true) => {
		const bgGradient = emboss ? linearGradient({
			colorStops: [
				`${lighten(0.5, color)} 0%`,
				`${lighten(0.2, color)} 10%`,
				`${color} 15%`,
				`${color} 90%`,
				`${darken(0.3, color)} 100%`,
			],
		}) : linearGradient({
			colorStops: [
				`${darken(0.3, color)} 0%`,
				`${color} 10%`,
				`${color} 95%`,
				`${darken(0.3, color)} 100%`,
			],
		});
		const pattern = gridBackgroundImagePattern(rgba(lighten(0.3, color), 0.25), darken(0.2, color));

		return {
			...bgGradient,
			backgroundImage: [
				pattern.backgroundImage,
				bgGradient.backgroundImage,
			].join(', '),
			backgroundSize: [
				pattern.backgroundSize,
				'100% 100%',
			].join(', '),
			backgroundPosition: [
				pattern.backgroundPosition,
				'0',
			].join(', '),
		};
	};

	const menuButton = (color: { main: Color, contrastText: Color }) => ({
		...toolbarGradient(color.main),
		boxShadow: '0',
		color: color.contrastText,
		'&:hover': {
			...toolbarGradient(color.main, false),
			boxShadow: 'inset 2px 0px 5px rgba(0, 0, 0, 0.6), inset -2px 0px 2px rgba(0, 0, 0, 0.1)',
			'& span, & svg': {
				textShadow: `0 0 2px #ffffff, 0 0 5px ${invert(color.contrastText)}`,
			},
		},
	});

	const styles: IAppThemeOptions = {
		typography: {
			htmlFontSize: 16,
			useNextVariants: true,
		},
		icons: {
			config: ConfigIcon,
			undo: UndoIcon,
			soundOn: SoundOnIcon,
		},
		palette,
		layout: {
			primary: {
				root: {
					...paperPattern,
				},
			},
			fullscreen: {
				root: {
					...radialGradient({
						colorStops: [
							`${rgba(backGroundColor, inverseTheme ? 0.2 : 0.8)} 10%`,
							`${rgba(backGroundColor, inverseTheme ? 0.8 : 0.2)} 100%`,
						],
						extent: 'ellipse at 0% 5%',
					}),
				},
			},
			container: {
				wrapper: {
					maxWidth: '1200px',
					padding: `64px 64px`,
					background: palette.background.paper,
					boxShadow: palette.type === 'dark' ? 'inset 2px 2px 4px #000' : 'none',
					[breakpoints.down('sm')]: {
						padding: `24px 24px`,
						margin: `0`,
					},
				},
			},
			toolbarHeight,
		},
		overrides: {
			MuiToolbar: {
				root: {
					...toolbarGradient(colorDefault.main),
					[breakpoints.down('sm')]: {
						justifyContent: 'flex-end',
					},
				},
			},
			MuiDrawer: {
				paper: {
					...darkBgPattern,
				},
			},
			TopMenuButton: {
				root: {
					borderRadius: '0',
					minHeight: toolbarHeight,
					...menuButton(colorDefault),
				},
				primary: {
					...menuButton(palette.primary),
				},
				secondary: {
					...menuButton(palette.secondary),
				},
				label: {
					// color: '#ffffff',
				},
			},
			MuiPaper: {
				root: {
				},
			},
		},
		props: {
			// TopMenuButton: {
			// 	disableRipple: true,
			// },
			MuiToolbar: {
				variant: 'dense',
				disableGutters: true,
			},
			MuiDrawer: {
				anchor: 'left',
			},
		},
	};

	return createTheme(styles);
};
