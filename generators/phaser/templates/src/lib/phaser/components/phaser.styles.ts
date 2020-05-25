import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { IAppTheme } from 'theme';

export const useStyles = makeStyles((theme: Theme) => {
	const appTheme: IAppTheme = theme as IAppTheme;

	return createStyles({
		root: {
			backgroundColor: appTheme.palette.type === 'dark' ? appTheme.palette.grey['900'] : appTheme.palette.grey['500'],
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			minWidth: '320px',
			minHeight: '100px',
			width: '100%',
			padding: '0',
			overflow: 'hidden',
		},
	});
});
