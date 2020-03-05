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
import { ConfigLink, IntroLink } from 'components/ui/core/navigation-links';

import LanguageSelectorComponent from './language-selector/language-selector';

export interface IMenuItemExternalProps {
	active?: boolean;
	activeColor?: PropTypes.Color;
	ActiveIcon?: React.ComponentType;
	color?: PropTypes.Color;
	component?: React.ReactType;
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
	dispatchCreateSetMutedAction: (value: boolean) => void;
	dispatchSetFullscreenAction: (value: boolean) => void;
	getTheme: () => IAppTheme;
}

/** Internal component state. */
interface IMenuState {
	compactMode: boolean;
	fullscreen: boolean;
	/** required for interface updates after changing application language */
	language: LanguageType;
	/** required for interface updates after loading language */
	languages: any;
	mute: boolean;
}

type IMenuProps = IMenuExternalProps & IMenuInternalProps & RouteComponentProps;

const diDecorator = connectToInjector<IMenuExternalProps, IMenuInternalProps>({
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
			fullscreen,
			mute,
		} = this.state;
		const theme = getTheme();

		// TODO: need menu component that renders diffrent buttons depending on context (toolbar, drawer) and is influenced by css theme
		return (
			<>
				{!location.pathname.startsWith('/config') ? (
					<MenuItem
						// prettier-ignore
						color="primary"
						component={ConfigLink}
						Icon={theme.icons.config}
						key="config"
						label={__('Configuration')}
					/>
				) : (
					<MenuItem
						// prettier-ignore
						color="primary"
						component={IntroLink}
						Icon={theme.icons.undo}
						key="config"
						label={__('Back')}
					/>
				)}

				<MenuItem
					// prettier-ignore
					active={fullscreen}
					ActiveIcon={theme.icons.fullscreenOn}
					color="default"
					Icon={theme.icons.fullscreenOff}
					key="fullscreen"
					label={__('Fullscreen')}
					onClick={this.toggleFullScreen}
				/><% if (useSound) { %>

				<MenuItem
					// prettier-ignore
					active={mute}
					ActiveIcon={theme.icons.muteOn}
					color="default"
					Icon={theme.icons.muteOff}
					label={__('Mute')}
					onClick={this.toggleMute}
				/><% } %>

				<LanguageSelectorComponent MenuItem={MenuItem} />
			</>
		);
	}

	private toggleFullScreen = (): void => {
		const { dispatchSetFullscreenAction, store } = this.props;
		const { fullscreen = false } = store ? store.getState() : {};
		dispatchSetFullscreenAction(!fullscreen);
	}<% if (useSound) { %>

	private toggleMute = (): void => {
		const { dispatchCreateSetMutedAction, store } = this.props;
		const { mute = false } = store ? store.getState() : {};
		dispatchCreateSetMutedAction(!mute);
	}<% } %>
}

export default hot(module)(withRouter(diDecorator(MenuComponent)));
