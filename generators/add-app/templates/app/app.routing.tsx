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
);

function AppRouting(): React.ReactElement {
	return (
		<Switch>
			<Route
				component={IntroView}
				exact
				path="/"
			/>
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
			/>
		</Switch>
	);
}

export default hot(module)(AppRouting);
