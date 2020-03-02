import * as React from 'react';
import { hot } from 'react-hot-loader';

// elements
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

import { useStyles } from './intro-view.styles';

/** Component public properties required to be provided by parent component. */
export interface IIntroViewExternalProps {
}

/** Internal component properties include properties injected via dependency injection. */
interface IIntroViewInternalProps {
	__: II18nTranslation;
}

type IIntroViewProps = IIntroViewExternalProps & IIntroViewInternalProps;

const diDecorator = connectToInjector<IIntroViewExternalProps, IIntroViewInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
});

function IntroViewComponent(props: IIntroViewProps) {
	const { __ } = props;
	const classes = useStyles();

	return (
		<Paper className={classes.root} elevation={0}>
			<Typography align="center" className={classes.title} component="h1" variant="h1">
				{__( `<%= appTitle %>` )}
			</Typography>
			<Typography align="center" className={classes.description} component="p" variant="h5">
				{__( `<%= appDescription %>` )}
			</Typography><% if (usePixi) { %>
			<PixiComponent className={classes.screen}/><% } %>
		</Paper>
	);
}

export default hot(module)(diDecorator(IntroViewComponent));
