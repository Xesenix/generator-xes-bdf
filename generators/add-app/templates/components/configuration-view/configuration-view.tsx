import { withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

// elements
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';

// icons
import SoundOffIcon from '@material-ui/icons/FlashOff';
import SoundOnIcon from '@material-ui/icons/FlashOn';
import MusicOnIcon from '@material-ui/icons/MusicNote';
import MusicOffIcon from '@material-ui/icons/MusicOff';
import MuteOffIcon from '@material-ui/icons/VolumeOff';
import MuteOnIcon from '@material-ui/icons/VolumeUp';

import { connectToInjector } from 'lib/di';
import { II18nActions, II18nState } from 'lib/i18n';
import { defaultUIState, IUIActions, IUIState } from 'lib/ui';

import { styles } from './configuration-view.styles';

export interface IConfigurationProps {
	store?: Store<IUIState & II18nState>;
	dispatchSetCurrentLanguageAction: () => void;
	dispatchSetEffectsMutedAction: () => void;
	dispatchSetEffectsVolumeAction: () => void;
	dispatchSetMusicMutedAction: () => void;
	dispatchSetMusicVolumeAction: () => void;
	dispatchSetMutedAction: () => void;
	dispatchSetThemeAction: () => void;
	dispatchSetVolumeAction: () => void;
	__: (key: string) => string;
}

const diDecorator = connectToInjector<IConfigurationProps>({
	store: {
		dependencies: ['data-store'],
	},
	__: {
		dependencies: ['i18n:translate'],
	},
	dispatchSetCurrentLanguageAction: {
		dependencies: ['i18n:actions'],
		value: (actions: II18nActions) => Promise.resolve((event) => actions.setCurrentLanguage(event.target.value)),
	},
	dispatchSetEffectsMutedAction: {
		dependencies: ['ui:actions'],
		value: (actions: IUIActions) => Promise.resolve((event, checked: boolean) => actions.setEffectsMuted(checked)),
	},
	dispatchSetEffectsVolumeAction: {
		dependencies: ['ui:actions'],
		value: (actions: IUIActions) => Promise.resolve((event, value) => actions.setEffectsVolume(value)),
	},
	dispatchSetMusicMutedAction: {
		dependencies: ['ui:actions'],
		value: (actions: IUIActions) => Promise.resolve((event, checked: boolean) => actions.setMusicMuted(checked)),
	},
	dispatchSetMusicVolumeAction: {
		dependencies: ['ui:actions'],
		value: (actions: IUIActions) => Promise.resolve((event, value) => actions.setMusicVolume(value)),
	},
	dispatchSetMutedAction: {
		dependencies: ['ui:actions'],
		value: (actions: IUIActions) => Promise.resolve((event, checked: boolean) => actions.setMuted(checked)),
	},
	dispatchSetThemeAction: {
		dependencies: ['ui:actions'],
		value: (actions: IUIActions) => Promise.resolve((event) => actions.setTheme(event.target.value)),
	},
	dispatchSetVolumeAction: {
		dependencies: ['ui:actions'],
		value: (actions: IUIActions) => Promise.resolve((event, value) => actions.setVolume(value)),
	},
});

export interface IConfigurationState {}

export class ConfigurationViewComponent extends React.Component<IConfigurationProps & WithStyles<typeof styles>, IConfigurationState> {
	public render(): any {
		const {
			classes,
			store = { getState: () => ({ ...defaultUIState, language: 'en' }) },
			dispatchSetCurrentLanguageAction,
			dispatchSetEffectsMutedAction,
			dispatchSetEffectsVolumeAction,
			dispatchSetMusicMutedAction,
			dispatchSetMusicVolumeAction,
			dispatchSetMutedAction,
			dispatchSetThemeAction,
			dispatchSetVolumeAction,
			__,
		} = this.props;
		const { mute, musicMuted, effectsMuted, volume, musicVolume, effectsVolume, language, theme } = store.getState();

		return (
			<form className={classes.root}>
				<Typography variant="headline" component="h1">
					{__('Sound configuration')}
				</Typography>
				<Grid container spacing={0} alignItems="stretch" component="section">
					<Grid item xs={6} sm={4}>
						<FormControlLabel
							className={classes.margin}
							label={__('master mute')}
							control={<Checkbox checkedIcon={<MuteOffIcon />} icon={<MuteOnIcon />} checked={mute} onChange={dispatchSetMutedAction} />}
						/>
					</Grid>
					<Grid item xs={6} sm={4}>
						<FormControlLabel
							className={classes.margin}
							label={__('music mute')}
							control={<Checkbox checkedIcon={<MuteOffIcon />} icon={<MuteOnIcon />} checked={musicMuted} onChange={dispatchSetMusicMutedAction} />}
						/>
					</Grid>
					<Grid item xs={6} sm={4}>
						<FormControlLabel
							className={classes.margin}
							label={__('fx mute')}
							control={<Checkbox checkedIcon={<MuteOffIcon />} icon={<MuteOnIcon />} checked={effectsMuted} onChange={dispatchSetEffectsMutedAction} />}
						/>
					</Grid>
					<Grid item xs={12} container>
						<Grid item xs={12} md={3}>
							<FormControlLabel className={classes.margin} label={__('master volume')} control={<span className={classes.icon}>{mute ? <MuteOffIcon /> : <MuteOnIcon />}</span>} />
						</Grid>
						<Grid item xs={12} md={9} className={classes.scroll}>
							<Slider min={0} max={1} step={1 / 32} value={volume} onChange={dispatchSetVolumeAction} />
						</Grid>
					</Grid>
					<Grid item xs={12} container>
						<Grid item xs={12} md={3}>
							<FormControlLabel
								className={classes.margin}
								label={__('music volume')}
								control={<span className={classes.icon}>{mute || musicMuted ? <MusicOffIcon /> : <MusicOnIcon />}</span>}
							/>
						</Grid>
						<Grid item xs={12} md={9} className={classes.scroll}>
							<Slider min={0} max={1} step={1 / 32} value={musicVolume} onChange={dispatchSetMusicVolumeAction} />
						</Grid>
					</Grid>
					<Grid item xs={12} container>
						<Grid item xs={12} md={3}>
							<FormControlLabel
								className={classes.margin}
								label={__('sound volume')}
								control={<span className={classes.icon}>{mute || effectsMuted ? <SoundOffIcon /> : <SoundOnIcon />}</span>}
							/>
						</Grid>
						<Grid item xs={12} md={9} className={classes.scroll}>
							<Slider min={0} max={1} step={1 / 32} value={effectsVolume} onChange={dispatchSetEffectsVolumeAction} />
						</Grid>
					</Grid>
				</Grid>
				<Typography variant="headline" component="h1">
					{__('User interface configuration')}
				</Typography>
				<Grid item xs={12} container component="section">
					<FormControl className={classes.formControl}>
						<InputLabel>{__('language')}</InputLabel>
						<Select value={language} onChange={dispatchSetCurrentLanguageAction}>
							<MenuItem value={'en'}>{__('english')}</MenuItem>
							<MenuItem value={'pl'}>{__('polish')}</MenuItem>
						</Select>
					</FormControl>
					<FormControl className={classes.formControl}>
						<InputLabel>{__('theme')}</InputLabel>
						<Select value={theme} onChange={dispatchSetThemeAction}>
							<MenuItem value={'light'}>{__('light')}</MenuItem>
							<MenuItem value={'dark'}>{__('dark')}</MenuItem>
						</Select>
					</FormControl>
				</Grid>
			</form>
		);
	}
}

export default hot(module)(diDecorator(withStyles(styles)(ConfigurationViewComponent)));
