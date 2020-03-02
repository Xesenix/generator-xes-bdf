import { createStyles, Theme } from '@material-ui/core';

export const styles = (theme: Theme) =>
	createStyles({
		root: {
			backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey['900'] : theme.palette.grey['500'],
			display: 'flex',
			justifyContent: 'center',
			minWidth: '320px',
			minHeight: '100px',
			width: '100%',
			padding: '0',
		},
	});
