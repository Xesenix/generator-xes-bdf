import { Theme } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) =>
	createStyles({
		root: {
			minHeight: '600px',
			padding: '0',
		},
		button: {
			margin: theme.spacing.unit,
		},
		extendedIcon: {
			marginRight: theme.spacing.unit,
		},
	});
