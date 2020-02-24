import * as React from 'react';
import { hot } from 'react-hot-loader';
import { RouteComponentProps, withRouter } from 'react-router';

import { connectToInjector } from 'lib/di';
import {
	// prettier-ignore
	diStoreComponentDependencies,
	IStoreComponentInternalProps,
} from 'lib/utils/store.component';

// elements
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';

// icons
import MenuIcon from '@material-ui/icons/Menu';

import DrawerMenuButton from 'components/ui/core/drawer-menu-button';
import TopMenuButton from 'components/ui/core/top-menu-button';
import { IMenuExternalProps } from 'components/ui/menu/menu';

import { useStyles } from './primary-layout.styles';

/** Component public properties required to be provided by parent component. */
export interface IPrimaryLayoutExternalProps {
	content: any;
	Menu: React.ComponentType<IMenuExternalProps>;
	loading?: boolean;
}

/** Internal component properties include properties injected via dependency injection. */
interface IPrimaryLayoutInternalProps extends IStoreComponentInternalProps<IPrimaryLayoutState> {
	dispatchSetDrawerOpenAction: (value: boolean) => void;
}

/** Internal component state. */
interface IPrimaryLayoutState {
	drawerOpen: boolean;
}

type IPrimaryLayoutProps = IPrimaryLayoutExternalProps & IPrimaryLayoutInternalProps & RouteComponentProps;

const diDecorator = connectToInjector<IPrimaryLayoutExternalProps, IPrimaryLayoutInternalProps>({
	...diStoreComponentDependencies,
	dispatchSetDrawerOpenAction: {
		dependencies: ['ui:actions@setDrawerOpen'],
		value: (setDrawerOpen: (value: boolean) => void) => Promise.resolve(setDrawerOpen),
	},
});

function PrimaryLayoutComponent(props: IPrimaryLayoutProps) {
	const {
		// prettier-ignore
		bindToStore,
		content = null,
		dispatchSetDrawerOpenAction,
		loading = false,
		location,
		Menu,
	} = props;

	const classes = useStyles();

	const { drawerOpen } = bindToStore([
		// prettier-ignore
		'drawerOpen',
	]);

	const toggleDrawer = React.useCallback((): void => {
		dispatchSetDrawerOpenAction(!drawerOpen);
	}, [dispatchSetDrawerOpenAction, drawerOpen]);

	return (
		<>
			<AppBar position="fixed">
				<Toolbar>
					<Hidden smDown>
						<Menu
							key="menu"
							MenuItem={TopMenuButton}
						/>
					</Hidden>
					<Hidden mdUp>
						<TopMenuButton
							color="primary"
							Icon={MenuIcon}
							onClick={toggleDrawer}
						/>
					</Hidden>
				</Toolbar>
				{loading ? <LinearProgress/> : null}
			</AppBar>

			<Hidden mdUp>
				<Drawer
					onClose={toggleDrawer}
					open={drawerOpen}
				>
					<Menu
						key="drawer-menu"
						MenuItem={DrawerMenuButton}
					/>
				</Drawer>
			</Hidden>
			<Paper
				className={classes.root}
				elevation={0}
			>
				<Slide
					direction="left"
					in={true}
					key={location.pathname.split('/')[1]}
				>
					<div className={classes.container}>{content}</div>
				</Slide>
			</Paper>
		</>
	);
}

export default hot(module)(withRouter(diDecorator(PrimaryLayoutComponent))) as any as React.ComponentType<IPrimaryLayoutExternalProps>;
