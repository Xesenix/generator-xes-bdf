import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Redirect, Route, Switch } from 'react-router-dom';

import Loader from 'components/ui/loader/loader';
import LoaderErrorView from 'components/ui/loader/loader-error-view';

import LazyLoaderFactory from 'lib/core/components/lazy-loader-factory';

const BigLoader = () => <Loader size={128}/>;

const IntroView = LazyLoaderFactory(
	() => import(/* webpackChunkName: "intro" */ 'components/views/intro-view/intro-view'),
	BigLoader,
	LoaderErrorView,
);
const ConfigurationView = LazyLoaderFactory(
	() => import(/* webpackChunkName: "config" */ 'components/views/configuration-view/configuration-view'),
	BigLoader,
	LoaderErrorView,
);<% if (usePhaser) { %>
const PhaserView = LazyLoaderFactory(
	() => import(/* webpackChunkName: "game" */ 'lib/phaser/components/phaser'),
	BigLoader,
	LoaderErrorView,
);<% } %><% if (usePixi) { %>
const PixiView = LazyLoaderFactory(
	() => import(/* webpackChunkName: "game" */ 'lib/pixi/components/pixi'),
	BigLoader,
	LoaderErrorView,
);<% } %>

function AppRouting(): React.ReactElement {
	return (
		<Switch>
			<Route
				component={IntroView}
				exact
				path="/"
			/>
			<Route exact path="/config">
				<Redirect to="/config/<%= useSound ? 'sound' : 'ui' %>"/>
			</Route>
			<Route
				component={ConfigurationView}
				path="/config"
			/><% if (usePhaser) { %>
			<Route
				component={PhaserView}
				path="/game/play"
			/><% } %><% if (usePixi) { %>
			<Route
				component={PixiView}
				path="/game/play"
			/><% } %>
		</Switch>
	);
}

export default hot(module)(AppRouting);
