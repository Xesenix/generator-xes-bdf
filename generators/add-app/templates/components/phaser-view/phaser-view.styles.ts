import { Theme } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => createStyles({
	root: {
		minHeight: '600px',
		padding: '0',
		display: 'flex',
		justifyContent: 'center',
		backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey['900'] : theme.palette.grey['500'],
	},
});
