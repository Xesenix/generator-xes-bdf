import * as React from 'react';
import { hot } from 'react-hot-loader';
import { RouteComponentProps, withRouter } from 'react-router';

import { connectToInjector } from 'lib/di';
import { IEventEmitter } from 'lib/interfaces';
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

import { useStyles } from './fullscreen-layout.styles';

/** Component public properties required to be provided by parent component. */
export interface IFullscreenLayoutExternalProps {
	content: any;
	Menu: React.ComponentType<IMenuExternalProps>;
	loading?: boolean;
}

/** Internal component properties include properties injected via dependency injection. */
interface IFullscreenLayoutInternalProps extends IStoreComponentInternalProps<IFullscreenLayoutState>  {
	dispatchSetDrawerOpenAction: (value: boolean) => void;
	em: IEventEmitter;
}

/** Internal component state. */
interface IFullscreenLayoutState {
	drawerOpen: boolean;
}

type IFullscreenLayoutProps = IFullscreenLayoutExternalProps & IFullscreenLayoutInternalProps & RouteComponentProps;

const diDecorator = connectToInjector<IFullscreenLayoutExternalProps, IFullscreenLayoutInternalProps>({
	...diStoreComponentDependencies,
	dispatchSetDrawerOpenAction: {
		dependencies: ['ui:actions@setDrawerOpen'],
		value: (setDrawerOpen: (value: boolean) => void) => Promise.resolve(setDrawerOpen),
	},
	em: {
		dependencies: ['event-manager'],
	},
});

function FullscreenLayoutComponent(props: IFullscreenLayoutProps) {
	const {
		// prettier-ignore
		bindToStore,
		content = null,
		dispatchSetDrawerOpenAction,
		em,
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

	const onTransitionEnd = React.useCallback((): void => {
		em.emit('layout:transition:end');
	}, [em]);

	return (
		<>
			<AppBar position="fixed">
				<Toolbar>
					<Hidden smDown>
						<Menu
							key="fullscreen-menu"
							MenuItem={TopMenuButton}
						/>
					</Hidden>
					<Hidden mdUp>
						<TopMenuButton
							color="primary"
							onClick={toggleDrawer}
							Icon={MenuIcon}
						/>
					</Hidden>
				</Toolbar>
				{loading ? <LinearProgress/> : null}
			</AppBar>

			<Hidden mdUp>
				<Drawer
					anchor="left"
					onClose={toggleDrawer}
					open={drawerOpen}
				>
					<Menu
						key="fullscreen-drawer-menu"
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
					onEntered={onTransitionEnd}
				>
					<div className={classes.container}>{content}</div>
				</Slide>
			</Paper>
		</>
	);
}

export default hot(module)(withRouter(diDecorator(FullscreenLayoutComponent))) as any as React.ComponentType<IFullscreenLayoutExternalProps>;
