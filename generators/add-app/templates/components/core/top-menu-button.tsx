import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { hot } from 'react-hot-loader';

// elements
import Fab from '@material-ui/core/Fab';

import { IMenuItemExternalProps } from 'components/menu/menu';

export const styles = (theme: Theme) => {
	return createStyles({
		root: {
			'& svg': {
				width: '32px',
				fontSize: 'xx-large',
			},
		},
		label: {
			display: 'flex',
			justifyContent: 'stretch',
		},
		primary: {

		},
		secondary: {

		},
		focusVisible: {

		},
	});
};

const TopMenuButton = (props: IMenuItemExternalProps & WithStyles<typeof styles>) => {
	const Icon = props.active && props.ActiveIcon ? props.ActiveIcon : props.Icon ? props.Icon : null;

	return (
		<Fab
			classes={props.classes}
			color={props.active && props.activeColor ? props.activeColor : props.color}
			component={props.component as any}
			onClick={props.onClick}
			variant="extended"
		>
			{Icon ? <Icon/> : null}
			{props.label || ''}
		</Fab>
	);
};

export default hot(module)(withStyles(styles, { name: 'TopMenuButton' })(TopMenuButton));
