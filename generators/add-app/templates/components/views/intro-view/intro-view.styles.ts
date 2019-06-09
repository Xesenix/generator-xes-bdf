import { createStyles, Theme } from '@material-ui/core/styles';

import { IAppTheme } from 'theme';

export const styles = (theme: Theme) => {
	const appTheme: IAppTheme = theme as IAppTheme;
	const title = {
		...theme.typography.title,
		marginBottom: '.5em',
	};

	return createStyles({
		root: {
			alignItems: 'center',
			display: 'grid',
			padding: '24px 0px 36px',
			margin: '24px auto 24px',
			...appTheme.layout.container.wrapper,
		},
		title: {
			...title,
			fontSize: 'calc(1.5em + 3.75vw)',
			marginBottom: '.25em',
		},
		subtitle: {
			...theme.typography.subtitle1,
			...title,
			fontSize: 'calc(1.25em + 3vw)',
		},
		description: {
			...theme.typography.body1,
			fontSize: 'calc(.75em + 1vw)',
			marginBottom: '1.5em',
			padding: '0 24px',
			textAlign: 'justify',
		},
		cta: {
			justifySelf: 'center',
			padding: '0 24px',
			width: '320px',
		},
	});
};
