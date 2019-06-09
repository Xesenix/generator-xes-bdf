import { PropTypes } from '@material-ui/core';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { RouteComponentProps, withRouter } from 'react-router';

import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';
import { LanguageType } from 'lib/interfaces';
import {
	// prettier-ignore
	diStoreComponentDependencies,
	IStoreComponentInternalProps,
	StoreComponent,
} from 'lib/utils/store.component';
import { IAppTheme } from 'theme';

// elements
import { ConfigLink, GameLink } from 'components/core/navigation-links';

import LanguageSelectorComponent from './language-selector/language-selector';

export interface IMenuItemExternalProps {
	active?: boolean;
	activeColor?: PropTypes.Color;
	color?: PropTypes.Color;
	component?: React.ReactType;
	ActiveIcon?: React.ComponentType;
	Icon?: React.ComponentType;
	label?: React.ReactNode;
	onClick?: () => void;
}

/** Component public properties required to be provided by parent component. */
export interface IMenuExternalProps {
	MenuItem: React.ComponentType<IMenuItemExternalProps>;
}

/** Internal component properties include properties injected via dependency injection. */
interface IMenuInternalProps extends IStoreComponentInternalProps<IMenuState> {
	__: II18nTranslation;
	dispatchCreateSetCompactModeAction: (value: boolean) => void;
	dispatchCreateSetMutedAction: (value: boolean) => void;
	dispatchSetFullscreenAction: (value: boolean) => void;
	getTheme: () => IAppTheme;
}

/** Internal component state. */
interface IMenuState {
	fullscreen: boolean;
	mute: boolean;
	compactMode: boolean;
	/** required for interface updates after changing application language */
	language: LanguageType;
	/** required for interface updates after loading language */
	languages: any;
}

type IMenuProps = IMenuExternalProps & IMenuInternalProps & RouteComponentProps;

const diDecorator = connectToInjector<IMenuProps, IMenuInternalProps>({
	...diStoreComponentDependencies,
	__: {
		dependencies: ['i18n:translate'],
	},
	dispatchSetFullscreenAction: {
		dependencies: ['ui:actions@setFullscreen'],
		value: (setFullscreen: (value: boolean) => void) => Promise.resolve(setFullscreen),
	},
	dispatchCreateSetMutedAction: {
		dependencies: ['ui:actions@setMuted'],
		value: (setMuted: (value: boolean) => void) => Promise.resolve(setMuted),
	},
	dispatchCreateSetCompactModeAction: {
		dependencies: ['ui:actions@setCompactMode'],
		value: (setCompactMode: (value: boolean) => void) => Promise.resolve(setCompactMode),
	},
	getTheme: {
		dependencies: ['theme:get-theme()'],
	},
});

class MenuComponent extends StoreComponent<IMenuProps, IMenuState> {
	constructor(props) {
		super(props, [
			// prettier-ignore
			'compactMode',
			'fullscreen',
			'language',
			'languages',
			'mute',
		]);
	}

	public render(): any {
		const {
			// prettier-ignore
			__,
			getTheme,
			location,
			MenuItem,
		} = this.props;
		const {
			// prettier-ignore
			compactMode,
			fullscreen,
			mute,
		} = this.state;
		const theme = getTheme();

		// TODO: need menu component that renders diffrent buttons depending on context (toolbar, drawer) and is influenced by css theme
		return (
			<>
				{location.pathname !== '/config' ? (
					<MenuItem
						// prettier-ignore
						color="primary"
						component={ConfigLink}
						key="config"
						Icon={theme.icons.config}
						label={__('Configuration')}
					/>
				) : null}

				{location.pathname === '/config' ? (
					<MenuItem
						// prettier-ignore
						color="primary"
						component={GameLink}
						key="game"
						Icon={theme.icons.undo}
						label={__('Back')}
					/>
				) : null}

				<MenuItem
					// prettier-ignore
					active={fullscreen}
					color="default"
					key="fullscreen"
					onClick={this.toggleFullScreen}
					ActiveIcon={theme.icons.fullscreenOn}
					Icon={theme.icons.fullscreenOff}
					label={__('Fullscreen')}
				/>

				<MenuItem
					// prettier-ignore
					active={mute}
					color="default"
					onClick={this.toggleMute}
					ActiveIcon={theme.icons.muteOn}
					Icon={theme.icons.muteOff}
					label={__('Mute')}
				/>
				<MenuItem
					// prettier-ignore
					active={compactMode}
					color="default"
					activeColor="secondary"
					onClick={this.toggleCompactMode}
					label={__('Compact')}
				/>

				<LanguageSelectorComponent MenuItem={MenuItem}/>
			</>
		);
	}

	private toggleFullScreen = (): void => {
		const { dispatchSetFullscreenAction, store } = this.props;
		const { fullscreen = false } = store ? store.getState() : {};
		dispatchSetFullscreenAction(!fullscreen);
	}

	private toggleMute = (): void => {
		const { dispatchCreateSetMutedAction, store } = this.props;
		const { mute = false } = store ? store.getState() : {};
		dispatchCreateSetMutedAction(!mute);
	}

	private toggleCompactMode = (): void => {
		const { dispatchCreateSetCompactModeAction, store } = this.props;
		const { compactMode = false } = store ? store.getState() : {};
		dispatchCreateSetCompactModeAction(!compactMode);
	}
}

export default hot(module)(withRouter(diDecorator(MenuComponent)));
