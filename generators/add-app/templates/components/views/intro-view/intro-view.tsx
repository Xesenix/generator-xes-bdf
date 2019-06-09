import { withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import { hot } from 'react-hot-loader';

// elements
import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

import { GameLink } from 'components/core/navigation-links';

import { styles } from './intro-view.styles';

/** Component public properties required to be provided by parent component. */
export interface IIntroViewExternalProps {
}

/** Internal component properties include properties injected via dependency injection. */
interface IIntroViewInternalProps {
	__: II18nTranslation;
}

type IIntroViewProps = IIntroViewExternalProps & IIntroViewInternalProps & WithStyles<typeof styles>;

const diDecorator = connectToInjector<IIntroViewProps, IIntroViewInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

function IntroViewComponent(props: IIntroViewProps) {
	const { classes, __ } = props;

	return (
		<Paper className={classes.root} elevation={0}>
			<Typography className={classes.title} variant="h1" component="h1" align="center">
				{__( `<%= appTitle %>` )}
			</Typography>
			<Typography className={classes.subtitle} variant="h4" component="h2" align="center">
				{__( `<%= author %>` )}
			</Typography>
			<Typography className={classes.description} variant="h5" component="p" align="center">
				{__( `<%= appDescription %>` )}{' '}
			</Typography>
			<Fab
				color="primary"
				component={GameLink}
				className={classes.cta}
				variant="extended"
			>
				{__( `Play` )}
			</Fab>
		</Paper>
	);
}

export default hot(module)(withStyles(styles)(diDecorator(IntroViewComponent)));
