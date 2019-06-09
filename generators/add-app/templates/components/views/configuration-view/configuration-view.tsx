import { withStyles, WithStyles } from '@material-ui/core';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';

import { connectToInjector } from 'lib/di';
import { II18nLanguagesState, II18nTranslation } from 'lib/i18n';
import { LanguageType } from 'lib/interfaces';
import { IAppTheme } from 'theme';

// elements
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';

import LanguageSelectorComponent from 'components/language/language-selector/language-selector';
import ThemeSelectorComponent from 'components/theme/theme-selector/theme-selector';

import { styles } from './configuration-view.styles';

/** Component public properties required to be provided by parent component. */
export interface IConfigurationViewExternalProps {}

/** Internal component properties include properties injected via dependency injection. */
interface IConfigurationViewInternalProps {
	__: II18nTranslation;
	di?: Container;
	dispatchSetEffectsMutedAction: (event: any, checked: boolean) => void;
	dispatchSetEffectsVolumeAction: (event: any, value: number) => void;
	dispatchSetMusicMutedAction: (event: any, checked: boolean) => void;
	dispatchSetMusicVolumeAction: (event: any, value: number) => void;
	dispatchSetMutedAction: (event: any, checked: boolean) => void;
	dispatchSetVolumeAction: (event: any, value: number) => void;
	getTheme: () => IAppTheme;
	bindToStore: (keys: (keyof IConfigurationViewState)[]) => IConfigurationViewState;
}

/** Internal component state. */
interface IConfigurationViewState {
	effectsMuted: boolean;
	effectsVolume: number;
	/** required for interface updates after changing application language */
	language: LanguageType;
	/** required for interface updates after loading language */
	languages: II18nLanguagesState;
	musicMuted: boolean;
	musicVolume: number;
	mute: boolean;
	volume: number;
}

type IConfigurationViewProps = IConfigurationViewExternalProps & IConfigurationViewInternalProps & WithStyles<typeof styles>;

const diDecorator = connectToInjector<IConfigurationViewProps, IConfigurationViewInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	dispatchSetEffectsMutedAction: {
		dependencies: ['ui:actions@setEffectsMuted'],
		value: (setEffectsMuted: (value: boolean) => void) => Promise.resolve((event: any, checked: boolean) => setEffectsMuted(checked)),
	},
	dispatchSetEffectsVolumeAction: {
		dependencies: ['ui:actions@setEffectsVolume'],
		value: (setEffectsVolume: (value: number) => void) => Promise.resolve((event: any, value: number) => setEffectsVolume(value)),
	},
	dispatchSetMusicMutedAction: {
		dependencies: ['ui:actions@setMusicMuted'],
		value: (setMusicMuted: (value: boolean) => void) => Promise.resolve((event: any, checked: boolean) => setMusicMuted(checked)),
	},
	dispatchSetMusicVolumeAction: {
		dependencies: ['ui:actions@setMusicVolume'],
		value: (setMusicVolume: (value: number) => void) => Promise.resolve((event: any, value: number) => setMusicVolume(value)),
	},
	dispatchSetMutedAction: {
		dependencies: ['ui:actions@setMuted'],
		value: (setMuted: (value: boolean) => void) => Promise.resolve((event: any, checked: boolean) => setMuted(checked)),
	},
	dispatchSetVolumeAction: {
		dependencies: ['ui:actions@setVolume'],
		value: (setVolume: (value: number) => void) => Promise.resolve((event: any, value: number) => setVolume(value)),
	},
	getTheme: {
		dependencies: ['theme:get-theme()'],
	},
	bindToStore: {
		dependencies: ['data-store:bind'],
	},
});

export function ConfigurationViewComponent(props: IConfigurationViewProps) {
	const {
		// prettier-ignore
		__,
		classes,
		dispatchSetEffectsMutedAction,
		dispatchSetEffectsVolumeAction,
		dispatchSetMusicMutedAction,
		dispatchSetMusicVolumeAction,
		dispatchSetMutedAction,
		dispatchSetVolumeAction,
		getTheme,
		bindToStore,
	} = props;
	const {
		// prettier-ignore
		effectsMuted,
		effectsVolume,
		musicMuted,
		musicVolume,
		mute,
		volume,
	} = bindToStore([
		// prettier-ignore
		'effectsMuted',
		'effectsVolume',
		'language',
		'languages',
		'musicMuted',
		'musicVolume',
		'mute',
		'volume',
	]);
	const theme = getTheme();
	const MuteOffIcon = theme.icons.muteOff;
	const muteOffIcon = <MuteOffIcon />;
	const MuteOnIcon = theme.icons.muteOn;
	const muteOnIcon = <MuteOnIcon />;
	const MusicOffIcon = theme.icons.musicOff;
	const musicOffIcon = <MusicOffIcon />;
	const MusicOnIcon = theme.icons.musicOn;
	const musicOnIcon = <MusicOnIcon />;
	const SoundOffIcon = theme.icons.soundOff;
	const soundOffIcon = <SoundOffIcon />;
	const SoundOnIcon = theme.icons.soundOn;
	const soundOnIcon = <SoundOnIcon />;

	return (
		<form className={classes.root}>
			<Typography variant="h5" component="h1" className={classes.section}>
				{__('Sound configuration')}
			</Typography>
			<Grid container spacing={0} alignItems="stretch" component="section" className={classes.section}>
				<Grid item xs={12} sm={4}>
					<FormControlLabel
						className={classes.margin}
						label={__('master mute')}
						control={<Checkbox checkedIcon={muteOnIcon} icon={muteOffIcon} checked={mute} onChange={dispatchSetMutedAction} />}
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<FormControlLabel
						className={classes.margin}
						label={__('music mute')}
						control={<Checkbox checkedIcon={musicOffIcon} icon={musicOnIcon} checked={musicMuted} onChange={dispatchSetMusicMutedAction} />}
					/>
				</Grid>
				<Grid item xs={12} sm={4}>
					<FormControlLabel
						className={classes.margin}
						label={__('fx mute')}
						control={<Checkbox checkedIcon={soundOffIcon} icon={soundOnIcon} checked={effectsMuted} onChange={dispatchSetEffectsMutedAction} />}
					/>
				</Grid>
				<Grid item xs={12} container>
					<Grid item xs={12} md={3}>
						<FormControlLabel
							className={classes.margin}
							label={__('master volume')}
							control={<span className={classes.icon}>{mute ? muteOnIcon : muteOffIcon}</span>}
						/>
					</Grid>
					<Grid item xs={12} md={9} className={classes.slider}>
						<Slider min={0} max={1} step={1 / 32} value={volume} onChange={dispatchSetVolumeAction} />
					</Grid>
				</Grid>
				<Grid item xs={12} container>
					<Grid item xs={12} md={3}>
						<FormControlLabel
							className={classes.margin}
							label={__('music volume')}
							control={<span className={classes.icon}>{mute || musicMuted ? musicOffIcon : musicOnIcon}</span>}
						/>
					</Grid>
					<Grid item xs={12} md={9} className={classes.slider}>
						<Slider min={0} max={1} step={1 / 32} value={musicVolume} onChange={dispatchSetMusicVolumeAction} />
					</Grid>
				</Grid>
				<Grid item xs={12} container>
					<Grid item xs={12} md={3}>
						<FormControlLabel
							className={classes.margin}
							label={__('sound volume')}
							control={<span className={classes.icon}>{mute || effectsMuted ? soundOffIcon : soundOnIcon}</span>}
						/>
					</Grid>
					<Grid item xs={12} md={9} className={classes.slider}>
						<Slider min={0} max={1} step={1 / 32} value={effectsVolume} onChange={dispatchSetEffectsVolumeAction} />
					</Grid>
				</Grid>
			</Grid>
			<Typography variant="h5" component="h1" className={classes.section}>
				{__('User interface configuration')}
			</Typography>
			<Grid item xs={12} container component="section" className={classes.section}>
				<FormControl className={classes.formControl}>
					<InputLabel>{__('language')}</InputLabel>
					<LanguageSelectorComponent/>
				</FormControl>
				<FormControl className={classes.formControl}>
					<InputLabel>{__('theme')}</InputLabel>
					<ThemeSelectorComponent/>
				</FormControl>
			</Grid>
		</form>
	);
}

export default hot(module)(withStyles(styles)(diDecorator(ConfigurationViewComponent)));
