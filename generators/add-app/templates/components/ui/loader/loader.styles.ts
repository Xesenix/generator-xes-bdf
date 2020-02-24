import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => {
	return createStyles({
		root: {
			alignItems: 'center',
			display: 'grid',
			height: '100%',
			justifyContent: 'center',
		},
		notification: {
			display: 'grid',
			gridGap: '24px',
			padding: '24px',
		},
		title: {},
		description: {},
		cta: {},
	});
});
