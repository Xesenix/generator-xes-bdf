import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import { hot } from 'react-hot-loader';

// elements
import Fab from '@material-ui/core/Fab';

import { IMenuItemExternalProps } from 'components/ui/menu/menu';

export const useStyles = makeStyles((theme: Theme) => {
	return createStyles({
		root: {},
	});
}, { name: 'DrawerMenuButton' });

const DrawerMenuButton = React.forwardRef((props: IMenuItemExternalProps, ref: any) => {
	const Icon = props.active && props.ActiveIcon ? props.ActiveIcon : props.Icon ? props.Icon : null;

	const classes = useStyles();

	return (
		<Fab
			classes={classes}
			color={props.active && props.activeColor ? props.activeColor : props.color}
			component={props.component as any}
			onClick={props.onClick}
			variant="extended"
		>
			{Icon ? <Icon /> : null}
			{props.label}
		</Fab>
	);
});

export default hot(module)(DrawerMenuButton);
