import { createStyles, Theme } from '@material-ui/core';

import { IAppTheme } from 'theme';

export const styles = (theme: Theme) => {
	const appTheme: IAppTheme = theme as IAppTheme;
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
		title: {

		},
		description: {

		},
		cta: {

		},
	});
};
