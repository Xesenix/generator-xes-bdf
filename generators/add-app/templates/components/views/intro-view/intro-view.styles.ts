import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { fluidSize } from 'lib/jss';
import { IAppTheme } from 'theme';

export const useStyles = makeStyles((theme: Theme) => {
	const appTheme: IAppTheme = theme as IAppTheme;
	const title = {
		...(theme.typography as any).title,
		marginBottom: '.5em',
	};

	return createStyles({
		root: {
			alignItems: 'center',
			display: 'flex',
			flexDirection: 'column',
			padding: '24px 0px 36px',
			margin: '0 auto',
			...appTheme.layout.container.wrapper,
		},
		title: {
			...title,
			...fluidSize('fontSize', 42, 84, 320, 1280),
			marginBottom: '.25em',
		},
		subtitle: {
			...theme.typography.subtitle1,
			...title,
			...fluidSize('fontSize', 24, 48, 320, 1280),
		},
		description: {
			...theme.typography.body1,
			...fluidSize('fontSize', 12, 24, 320, 1280),
			marginBottom: '1.5em',
			padding: '0 24px',
			textAlign: 'justify',
		},
		screen: {
			maxWidth: '800px',
			maxHeight: '600px',
		},
		cta: {
			justifySelf: 'center',
			padding: '0 24px',
			...fluidSize('width', 280, 480, 320, 1280),
		},
	});
});
