import { createStyles, Theme } from '@material-ui/core';

import { IAppTheme } from 'theme';

export const styles = (theme: Theme) => {
	const appTheme: IAppTheme = theme as IAppTheme;

	return createStyles({
		root: {
			...appTheme.layout.container.wrapper,
		},
	});
};
