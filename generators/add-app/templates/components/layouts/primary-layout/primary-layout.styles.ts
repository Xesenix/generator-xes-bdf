import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { IAppTheme } from 'theme';

export const useStyles = makeStyles((theme: Theme) => {
	const appTheme: IAppTheme = theme as IAppTheme;
	return createStyles({
		root: {
			alignItems: 'self-start',
			bottom: '32px',
			display: 'grid',
			left: '0',
			overflowX: 'hidden',
			overflowY: 'auto',
			position: 'fixed',
			right: '0',
			top: appTheme.layout.toolbarHeight,
			...appTheme.layout.primary.root,
		},
		container: {
			display: 'grid',
			gridTemplateColumns: 'minmax(320px, 1fr)',
			height: '100%',
		},
	});
});
