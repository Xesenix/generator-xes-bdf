import { createStyles, Theme } from '@material-ui/core';

export const styles = (theme: Theme) =>
	createStyles({
		root: {
			backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey['900'] : theme.palette.grey['500'],
			display: 'flex',
			justifyContent: 'center',
			minHeight: '100px',
			padding: '0',
		},
	});
