import { createStyles, makeStyles, Theme } from '@material-ui/core';

import { IAppTheme } from 'theme';

export const useStyles = makeStyles((theme: Theme) => {
	const appTheme: IAppTheme = theme as IAppTheme;

	return createStyles({
		root: {
			margin: '0 auto',
			padding: '16px',
			...appTheme.layout.container.wrapper,
		},
		margin: {
			margin: appTheme.spacing(),
		},
		icon: {
			alignItems: 'center',
			color: appTheme.palette.text.primary,
			display: 'inline-flex',
			height: '48px',
			justifyContent: 'center',
			width: '48px',
		},
		slider: {
			alignItems: 'center',
			display: 'inline-flex',
			height: '56px',
			overflow: 'hidden',
			padding: '0 24px',
			[appTheme.breakpoints.down('sm')]: {
				height: '28px',
			},
		},
		formControl: {
			margin: appTheme.spacing(),
			minWidth: 120,
		},
		section: {
			margin: '0 auto',
			padding: '24px 0',
		},
	});
});
