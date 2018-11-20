import { createStyles, Theme } from '@material-ui/core/styles';

export const styles = (theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			padding: '24px 4px 36px',
		},
		wrapper: {
			margin: theme.spacing.unit,
			position: 'relative',
		},
		headline: {
			marginBottom: '8px',
		},
	});
