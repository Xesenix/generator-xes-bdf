import * as React from 'react';
import { hot } from 'react-hot-loader';<% if (addLayout) { %>
import { MemoryRouter } from 'react-router-dom';

import LazyLoaderFactory from 'lib/core/components/lazy-loader-factory';
import { connectToInjector } from 'lib/di';
import { II18nLanguagesState } from 'lib/i18n';
import { LanguageType } from 'lib/interfaces';
import { IAppTheme, ThemesNames } from 'theme';

// elements
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';

import FullscreenLayoutComponent from 'components/layouts/fullscreen-layout/fullscreen-layout';
import PrimaryLayoutComponent from 'components/layouts/primary-layout/primary-layout';
import Loader from 'components/ui/loader/loader';
import LoaderErrorView from 'components/ui/loader/loader-error-view';
import { IMenuExternalProps } from 'components/ui/menu/menu';<% if (addRouting) { %>

import AppRouting from './app.routing';<% } else { %>
<% if (usePhaser) { %>
import PhaserViewComponent from 'lib/phaser/components/phaser-view';<% } %><% if (usePixi) { %>
import PixiComponent from 'lib/pixi/components/pixi';<% } } %>

const SmallLoader = () => <Loader size={48}/>;
const BigLoader = () => <Loader size={128}/>;

const MenuComponent = LazyLoaderFactory<IMenuExternalProps>(
	() => import(/* webpackChunkName: "menu" */ 'components/ui/menu/menu'),
	SmallLoader,
	LoaderErrorView,
);

/** Component public properties required to be provided by parent component. */
interface IAppExternalProps {}

/** Internal component properties include properties injected via dependency injection. */
interface IAppInternalProps {
	bindToStore: (keys: (keyof IAppState)[]) => IAppState;
	getTheme: () => IAppTheme;
}

/** Internal component state. */
interface IAppState {
	/** required for interface updates after changing fullscreen state */
	fullscreen: boolean;
	/** required for interface updates after changing application language */
	language: LanguageType;
	/** required for interface updates after loading language */
	languages: II18nLanguagesState;
	/** required for interface updates after changing application theme */
	theme: ThemesNames;
}

type IAppProps = IAppExternalProps & IAppInternalProps;

const diDecorator = connectToInjector<IAppExternalProps, IAppInternalProps>({
	bindToStore: {
		dependencies: ['data-store:bind'],
	},
	getTheme: {
		dependencies: ['theme:get-theme()'],
	},
}, { Preloader: BigLoader, });

function App(props: IAppProps) {
	const { getTheme, bindToStore } = props;
	const { fullscreen = false } = bindToStore([
		// prettier-ignore
		'fullscreen',
		'theme',
		'language',
		'languages',
	]);
<% if (addRouting) { %>
	const content = <AppRouting />;
<% } else { %>
	const content = (
		<>
			<h1><%= appTitle %></h1><% if (usePixi) { %>
			<PixiComponent /><% } %><% if (usePhaser) { %>
			<PhaserViewComponent keepInstanceOnRemove={true}/><% } %>
		</>
	);
<% } %>
	return (
		<MuiThemeProvider theme={getTheme()}>
			<CssBaseline />
			<MemoryRouter>
				{/* <React.StrictMode> */}
				{fullscreen ? (
					<FullscreenLayoutComponent Menu={MenuComponent} content={content} />
				) : (
					<PrimaryLayoutComponent
						Menu={MenuComponent}
						content={content}
					/>
				)}
				{/* </React.StrictMode> */}
			</MemoryRouter>
		</MuiThemeProvider>
	);
}

export default hot(module)(diDecorator(App));
<% } else { %>
<% if (usePhaser) { %>
import PhaserViewComponent from 'lib/phaser/components/phaser-view';<% } %><% if (usePixi) { %>
import PixiComponent from 'lib/pixi/components/pixi';<% } %>

import '../styles/app.scss';

function App() {
	return (
		<>
			<img src="assets/thumb.png"/>
			<div className="content">
				<h1><%= appTitle %></h1>
				<p><%= appDescription %></p><% if (usePixi) { %>
			<PixiComponent /><% } %><% if (usePhaser) { %>
			<PhaserViewComponent keepInstanceOnRemove={true}/><% } %>
			</div>
		</>
	);
}

export default hot(module)(App);
<% } %>
