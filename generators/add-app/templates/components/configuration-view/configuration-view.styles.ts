import { createStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';

export const styles = (theme: Theme) =>
	createStyles({
		root: {
			display: 'block',
			padding: '24px',
		},
		textField: {
			color: 'red',
			margin: theme.spacing.unit,
		},
		margin: {
			margin: theme.spacing.unit,
		},
		icon: {
			'display': 'inline-flex',
			'width': '48px',
			'height': '48px',
			'justify-content': 'center',
			'align-items': 'center',
			'color': theme.palette.text.primary,
		},
		scroll: {
			'display': 'inline-flex',
			'align-items': 'center',
		},
		formControl: {
			margin: theme.spacing.unit,
			minWidth: 120,
		},
	});
