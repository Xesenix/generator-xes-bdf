import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';

import { connectToInjector } from 'lib/di';
import { II18nLanguagesState, II18nTranslation } from 'lib/i18n';
import { LanguageType } from 'lib/interfaces';
import { IAppTheme } from 'theme';

// elements
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';

import EffectsVolumeComponent from './slider/effects-volume';
import MasterVolumeComponent from './slider/master-volume';
import MusicVolumeSliderComponent from './slider/music-volume';

import { useStyles } from '../configuration-view.styles';

/** Component public properties required to be provided by parent component. */
export interface ISoundConfigurationExternalProps {}

/** Internal component properties include properties injected via dependency injection. */
interface ISoundConfigurationInternalProps {
	__: II18nTranslation;
	bindToStore: (keys: (keyof ISoundConfigurationState)[]) => ISoundConfigurationState;
	di?: Container;
	dispatchSetEffectsMutedAction: (event: any, checked: boolean) => void;
	dispatchSetMusicMutedAction: (event: any, checked: boolean) => void;
	dispatchSetMutedAction: (event: any, checked: boolean) => void;
	getTheme: () => IAppTheme;
}

/** Internal component state. */
interface ISoundConfigurationState {
	effectsMuted: boolean;
	/** required for interface updates after changing application language */
	language: LanguageType;
	/** required for interface updates after loading language */
	languages: II18nLanguagesState;
	musicMuted: boolean;
	mute: boolean;
}

type ISoundConfigurationProps = ISoundConfigurationExternalProps & ISoundConfigurationInternalProps;

const diDecorator = connectToInjector<ISoundConfigurationExternalProps, ISoundConfigurationInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	bindToStore: {
		dependencies: ['data-store:bind'],
	},
	dispatchSetEffectsMutedAction: {
		dependencies: ['ui:actions@setEffectsMuted'],
		value: (setEffectsMuted: (value: boolean) => void) => Promise.resolve((event: any, checked: boolean) => setEffectsMuted(checked)),
	},
	dispatchSetMusicMutedAction: {
		dependencies: ['ui:actions@setMusicMuted'],
		value: (setMusicMuted: (value: boolean) => void) => Promise.resolve((event: any, checked: boolean) => setMusicMuted(checked)),
	},
	dispatchSetMutedAction: {
		dependencies: ['ui:actions@setMuted'],
		value: (setMuted: (value: boolean) => void) => Promise.resolve((event: any, checked: boolean) => setMuted(checked)),
	},
	getTheme: {
		dependencies: ['theme:get-theme()'],
	},
});

export function SoundConfigurationComponent(props: ISoundConfigurationProps) {
	const {
		// prettier-ignore
		__,
		bindToStore,
		dispatchSetEffectsMutedAction,
		dispatchSetMusicMutedAction,
		dispatchSetMutedAction,
		getTheme,
	} = props;
	const {
		// prettier-ignore
		effectsMuted,
		musicMuted,
		mute,
	} = bindToStore([
		// prettier-ignore
		'effectsMuted',
		'language',
		'languages',
		'musicMuted',
		'mute',
	]);
	const classes = useStyles();
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
		<>
			<Grid alignItems="stretch" className={classes.section} component="section" container spacing={0}>
				<Grid item sm={4} xs={12}>
					<FormControlLabel
						className={classes.margin}
						control={<Checkbox checked={mute} checkedIcon={muteOnIcon} icon={muteOffIcon} onChange={dispatchSetMutedAction} />}
						label={__('master mute')}
					/>
				</Grid>
				<Grid item sm={4} xs={12}>
					<FormControlLabel
						className={classes.margin}
						control={<Checkbox checked={musicMuted} checkedIcon={musicOffIcon} icon={musicOnIcon} onChange={dispatchSetMusicMutedAction} />}
						label={__('music mute')}
					/>
				</Grid>
				<Grid item sm={4} xs={12}>
					<FormControlLabel
						className={classes.margin}
						control={<Checkbox checked={effectsMuted} checkedIcon={soundOffIcon} icon={soundOnIcon} onChange={dispatchSetEffectsMutedAction} />}
						label={__('fx mute')}
					/>
				</Grid>
				<Grid container item xs={12}>
					<Grid item md={3} xs={12}>
						<FormControlLabel
							className={classes.margin}
							control={<span className={classes.icon}>{mute ? muteOnIcon : muteOffIcon}</span>}
							label={__('master volume')}
						/>
					</Grid>
					<Grid className={classes.slider} item xs={12} md={9}>
						<MasterVolumeComponent />
					</Grid>
				</Grid>
				<Grid container item xs={12}>
					<Grid item md={3} xs={12}>
						<FormControlLabel
							className={classes.margin}
							control={<span className={classes.icon}>{mute || musicMuted ? musicOffIcon : musicOnIcon}</span>}
							label={__('music volume')}
						/>
					</Grid>
					<Grid className={classes.slider} item xs={12} md={9}>
						<MusicVolumeSliderComponent />
					</Grid>
				</Grid>
				<Grid container item xs={12}>
					<Grid item md={3} xs={12}>
						<FormControlLabel
							className={classes.margin}
							control={<span className={classes.icon}>{mute || effectsMuted ? soundOffIcon : soundOnIcon}</span>}
							label={__('sound volume')}
						/>
					</Grid>
					<Grid className={classes.slider} item md={9} xs={12}>
						<EffectsVolumeComponent />
					</Grid>
				</Grid>
			</Grid>
		</>
	);
}

export default hot(module)(diDecorator(SoundConfigurationComponent)) as React.FunctionComponent<ISoundConfigurationExternalProps>;
