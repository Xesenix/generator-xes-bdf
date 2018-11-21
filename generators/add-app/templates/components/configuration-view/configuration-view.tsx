import { withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Action, Store } from 'redux';

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

import { IDataStoreProvider } from 'lib/data-store';
import { connectToInjector } from 'lib/di';
import { II18nState, LanguageType } from 'lib/i18n';
import { ICreateSetAction, IValueAction } from 'lib/interfaces';
import { defaultUIState, IUIState } from 'lib/ui';

import { styles } from './configuration-view.styles';

export interface IConfigurationProps {
	store?: Store<IUIState & II18nState>;
	dispatchCreateSetLanguageAction: () => ICreateSetAction<LanguageType>;
	dispatchCreateSetEffectsMutedAction: () => ICreateSetAction<boolean>;
	dispatchCreateSetEffectsVolumeAction: () => ICreateSetAction<number>;
	dispatchCreateSetMusicMutedAction: () => ICreateSetAction<boolean>;
	dispatchCreateSetMusicVolumeAction: () => ICreateSetAction<number>;
	dispatchCreateSetMutedAction: () => ICreateSetAction<boolean>;
	dispatchCreateSetThemeAction: () => ICreateSetAction<string>;
	dispatchCreateSetVolumeAction: () => ICreateSetAction<number>;
	__: (key: string) => string;
}
export interface IConfigurationState {}

export class ConfigurationViewComponent extends React.Component<IConfigurationProps & WithStyles<typeof styles>, IConfigurationState> {
	public render(): any {
		const {
			classes,
			store = { getState: () => ({ ...defaultUIState, language: 'en' }) },
			dispatchCreateSetLanguageAction,
			dispatchCreateSetEffectsMutedAction,
			dispatchCreateSetEffectsVolumeAction,
			dispatchCreateSetMusicMutedAction,
			dispatchCreateSetMusicVolumeAction,
			dispatchCreateSetMutedAction,
			dispatchCreateSetThemeAction,
			dispatchCreateSetVolumeAction,
			__,
		} = this.props;
		const { mute, musicMuted, effectsMuted, volume, musicVolume, effectsVolume, language, theme } = store.getState();

		return (
			<form className={classes.root}>
				<Typography variant="headline" component="h1">
					{__('Sound configuration')}
				</Typography>
				<Grid container={true} spacing={0} alignItems="stretch" component="section">
					<Grid item={true} xs={6} sm={4}>
						<FormControlLabel
							className={classes.margin}
							label={__('master mute')}
							control={<Checkbox
								checkedIcon={<MuteOffIcon />}
								icon={<MuteOnIcon />}
								checked={mute}
								onChange={dispatchCreateSetMutedAction}
							/>}
						/>
					</Grid>
					<Grid item={true} xs={6} sm={4}>
						<FormControlLabel
							className={classes.margin}
							label={__('music mute')}
							control={<Checkbox
								checkedIcon={<MuteOffIcon />}
								icon={<MuteOnIcon />}
								checked={musicMuted}
								onChange={dispatchCreateSetMusicMutedAction}
							/>}
						/>
					</Grid>
					<Grid item={true} xs={6} sm={4}>
						<FormControlLabel
							className={classes.margin}
							label={__('fx mute')}
							control={
								<Checkbox
									checkedIcon={<MuteOffIcon />}
									icon={<MuteOnIcon />}
									checked={effectsMuted}
									onChange={dispatchCreateSetEffectsMutedAction}
								/>
							}
						/>
					</Grid>
					<Grid item={true} xs={12} container={true}>
						<Grid item={true} xs={12} md={3}>
							<FormControlLabel className={classes.margin} label={__('master volume')} control={<span className={classes.icon}>{mute ? <MuteOffIcon /> : <MuteOnIcon />}</span>} />
						</Grid>
						<Grid item={true} xs={12} md={9} className={classes.scroll}>
							<Slider min={0} max={1} step={1 / 32} value={volume} onChange={dispatchCreateSetVolumeAction} />
						</Grid>
					</Grid>
					<Grid item={true} xs={12} container={true}>
						<Grid item={true} xs={12} md={3}>
							<FormControlLabel
								className={classes.margin}
								label={__('music volume')}
								control={<span className={classes.icon}>{mute || musicMuted ? <MusicOffIcon /> : <MusicOnIcon />}</span>}
							/>
						</Grid>
						<Grid item={true} xs={12} md={9} className={classes.scroll}>
							<Slider min={0} max={1} step={1 / 32} value={musicVolume} onChange={dispatchCreateSetMusicVolumeAction} />
						</Grid>
					</Grid>
					<Grid item={true} xs={12} container={true}>
						<Grid item={true} xs={12} md={3}>
							<FormControlLabel
								className={classes.margin}
								label={__('sound volume')}
								control={<span className={classes.icon}>{mute || effectsMuted ? <SoundOffIcon /> : <SoundOnIcon />}</span>}
							/>
						</Grid>
						<Grid item={true} xs={12} md={9} className={classes.scroll}>
							<Slider min={0} max={1} step={1 / 32} value={effectsVolume} onChange={dispatchCreateSetEffectsVolumeAction} />
						</Grid>
					</Grid>
				</Grid>
				<Typography variant="headline" component="h1">
					{__('User interface configuration')}
				</Typography>
				<Grid item={true} xs={12} container={true} component="section">
					<FormControl className={classes.formControl}>
						<InputLabel>{__('language')}</InputLabel>
						<Select value={language} onChange={dispatchCreateSetLanguageAction}>
							<MenuItem value={'en'}>{__('english')}</MenuItem>
							<MenuItem value={'pl'}>{__('polish')}</MenuItem>
						</Select>
					</FormControl>
					<FormControl className={classes.formControl}>
						<InputLabel>{__('theme')}</InputLabel>
						<Select value={theme} onChange={ dispatchCreateSetThemeAction }>
							<MenuItem value={'light'}>{__('light')}</MenuItem>
							<MenuItem value={'dark'}>{__('dark')}</MenuItem>
						</Select>
					</FormControl>
				</Grid>
			</form>
		);
	}
}

export default hot(module)(
	connectToInjector<IConfigurationProps>({
		store: {
			dependencies: ['data-store:provider'],
			value: (provider: IDataStoreProvider<IUIState & II18nState, IValueAction<any>>) => provider(),
		},
		__: {
			dependencies: ['i18n:translate'],
		},
		dispatchCreateSetLanguageAction: {
			dependencies: ['data-store:action:create:set-language', 'data-store'],
			value: (createAction, store) => Promise.resolve((event) => store.dispatch(createAction(event.target.value))),
		},
		dispatchCreateSetEffectsMutedAction: {
			dependencies: ['data-store:action:create:set-effects-muted', 'data-store'],
			value: (createAction, store) => Promise.resolve((event, checked: boolean) => store.dispatch(createAction(checked))),
		},
		dispatchCreateSetEffectsVolumeAction: {
			dependencies: ['data-store:action:create:set-effects-volume', 'data-store'],
			value: (createAction, store) => Promise.resolve((event, value) => store.dispatch(createAction(value))),
		},
		dispatchCreateSetMusicMutedAction: {
			dependencies: ['data-store:action:create:set-music-muted', 'data-store'],
			value: (createAction, store) => Promise.resolve((event, checked: boolean) => store.dispatch(createAction(checked))),
		},
		dispatchCreateSetMusicVolumeAction: {
			dependencies: ['data-store:action:create:set-music-volume', 'data-store'],
			value: (createAction, store) => Promise.resolve((event, value) => store.dispatch(createAction(value))),
		},
		dispatchCreateSetMutedAction: {
			dependencies: ['data-store:action:create:set-muted', 'data-store'],
			value: (createAction, store) => Promise.resolve((event, checked: boolean) => store.dispatch(createAction(checked))),
		},
		dispatchCreateSetThemeAction: {
			dependencies: ['data-store:action:create:set-theme', 'data-store'],
			value: (createAction, store) => Promise.resolve((event) => store.dispatch(createAction(event.target.value))),
		},
		dispatchCreateSetVolumeAction: {
			dependencies: ['data-store:action:create:set-volume', 'data-store'],
			value: (createAction, store) => Promise.resolve((event, value) => store.dispatch(createAction(value))),
		},
	})(withStyles(styles)(ConfigurationViewComponent)),
);
