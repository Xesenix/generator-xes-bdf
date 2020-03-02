import * as React from 'react';
import { hot } from 'react-hot-loader';
import { RouteComponentProps } from 'react-router';
import { Link, Route, Switch, useLocation } from 'react-router-dom';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

// elements
import Container from '@material-ui/core/Container';
import Fade from '@material-ui/core/Fade';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

import { ConfigureUILink } from 'components/ui/core/navigation-links';
<% if (useSound) { %>
import SoundConfigurationComponent from './sound/sound-configuration';<% } %>
import UIConfigurationComponent from './ui/ui-configuration';

import { useStyles } from './configuration-view.styles';

/** Component public properties required to be provided by parent component. */
export interface IConfigurationViewExternalProps {}

/** Internal component properties include properties injected via dependency injection. */
interface IConfigurationViewInternalProps {
	__: II18nTranslation;
}

type IConfigurationViewProps = IConfigurationViewExternalProps & IConfigurationViewInternalProps & RouteComponentProps;

const diDecorator = connectToInjector<IConfigurationViewExternalProps, IConfigurationViewInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

export function ConfigurationViewComponent(props: IConfigurationViewProps) {
	const {
		// prettier-ignore
		__,
	} = props;
	const location = useLocation();
	const classes = useStyles();
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<Container className={classes.root}>
			<Tabs
				scrollButtons={ matches ? 'on' : 'off' }
				value={location.pathname}
				variant="scrollable"
			><% if (useSound) { %>
				<Tab
					component={Link}
					label={__('Sound configuration')}
					to="/config/sound"
					value="/config/sound"
				/><% } %>
				<Tab
					component={ConfigureUILink}
					label={__('User interface configuration')}
					value="/config/ui"
				/>
			</Tabs>

			<Fade
				in={true}
				key={location.pathname.split('/')[2]}
			>
				<Container className={classes.section}>
					<Switch><% if (useSound) { %>
						<Route
							exact
							path="/config/sound"
							component={SoundConfigurationComponent}
						/><% } %>
						<Route
							exact
							path="/config/ui"
							component={UIConfigurationComponent}
						/>
					</Switch>
				</Container>
			</Fade>
		</Container>
	);
}

export default hot(module)(diDecorator(ConfigurationViewComponent));
