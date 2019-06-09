import { createMuiTheme } from '@material-ui/core/styles';
import { merge } from 'lodash';

// icons
import ConfigIcon from '@material-ui/icons/Build';
import SoundOffIcon from '@material-ui/icons/FlashOff';
import SoundOnIcon from '@material-ui/icons/FlashOn';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import FullScreenExitIcon from '@material-ui/icons/FullscreenExit';
import MusicOnIcon from '@material-ui/icons/MusicNote';
import MusicOffIcon from '@material-ui/icons/MusicOff';
import BackIcon from '@material-ui/icons/Undo';
import MuteOnIcon from '@material-ui/icons/VolumeOff';
import MuteOffIcon from '@material-ui/icons/VolumeUp';

import { IAppTheme, IAppThemeOptions } from './theme.interfaces';

export const createAppTheme = (theme: IAppThemeOptions): IAppTheme => {
	const MuiDrawer = {
		paper: {
			minWidth: '260px',
		},
	};

	let baseTheme = createMuiTheme({
		typography: {
			useNextVariants: true,
		},
		...theme,
	});

	// setup defaults for all custom theme fields
	// and common style overrides
	baseTheme = merge(baseTheme, {
		icons: {
			config: ConfigIcon,
			undo: BackIcon,
			fullscreenOn: FullScreenIcon,
			fullscreenOff: FullScreenExitIcon,
			muteOn: MuteOnIcon,
			muteOff: MuteOffIcon,
			musicOff: MusicOffIcon,
			musicOn: MusicOnIcon,
			soundOff: SoundOffIcon,
			soundOn: SoundOnIcon,
		},
		layout: {
			primary: {
				root: {
				},
			},
			fullscreen: {
				root: {
				},
			},
			container: {
				wrapper: {
				},
			},
			toolbarHeight: '64px',
		},
		overrides: {
			DrawerMenuButton: {
				root: {
					borderRadius: '0',

					minHeight: '0',
					padding: '0 24px 0 64px',
					'& span': {
						display: 'flex',
						justifyContent: 'stretch',
					},
					'& svg': {
						position: 'absolute',
						left: '16px',
						fontSize: 'xx-large',
					},
				},
			},
			TopMenuButton: {
				root: {
					'& svg': {
						fontSize: 'x-large',
					},
				},
			},
			MuiDrawer,
		},
	});

	return merge(baseTheme, theme) as IAppTheme;
};
