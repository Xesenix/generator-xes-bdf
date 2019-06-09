import { Slide, withStyles, WithStyles } from '@material-ui/core';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { RouteComponentProps, withRouter } from 'react-router';

import { connectToInjector } from 'lib/di';
import {
	// prettier-ignore
	diStoreComponentDependencies,
	IStoreComponentInternalProps,
	StoreComponent,
} from 'lib/utils/store.component';

// elements
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';

// icons
import MenuIcon from '@material-ui/icons/Menu';

import DrawerMenuButton from 'components/core/drawer-menu-button';
import TopMenuButton from 'components/core/top-menu-button';
import { IMenuExternalProps } from 'components/menu/menu';

import { styles } from './fullscreen-layout.styles';

/** Component public properties required to be provided by parent component. */
export interface IFullscreenLayoutExternalProps {
	content: any;
	Menu: React.ComponentType<IMenuExternalProps>;
	loading?: boolean;
}

/** Internal component properties include properties injected via dependency injection. */
interface IFullscreenLayoutInternalProps extends IStoreComponentInternalProps<IFullscreenLayoutState>  {
	dispatchSetDrawerOpenAction: (value: boolean) => void;
}

/** Internal component state. */
interface IFullscreenLayoutState {
	drawerOpen: boolean;
}

type IFullscreenLayoutProps = IFullscreenLayoutExternalProps & IFullscreenLayoutInternalProps & RouteComponentProps & WithStyles<typeof styles>;

const diDecorator = connectToInjector<IFullscreenLayoutProps, IFullscreenLayoutInternalProps>({
	...diStoreComponentDependencies,
	dispatchSetDrawerOpenAction: {
		dependencies: ['ui:actions@setDrawerOpen'],
		value: (setDrawerOpen: (value: boolean) => void) => Promise.resolve(setDrawerOpen),
	},
});

class FullscreenLayoutComponent extends StoreComponent<IFullscreenLayoutProps, IFullscreenLayoutState> {
	constructor(props) {
		super(props, [
			// prettier-ignore
			'drawerOpen',
		]);
	}

	public render(): any {
		const {
			// prettier-ignore
			classes,
			content = null,
			loading = false,
			location,
			Menu,
		} = this.props;

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
								onClick={this.toggleDrawer}
								Icon={MenuIcon}
							/>
						</Hidden>
					</Toolbar>
					{loading ? <LinearProgress/> : null}
				</AppBar>

				<Hidden mdUp>
					<Drawer
						anchor="left"
						onClose={this.toggleDrawer}
						open={this.state.drawerOpen}
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
						key={location.key}
						in={true}
						direction="left"
					>
						<div className={classes.container}>{content}</div>
					</Slide>
				</Paper>
			</>
		);
	}

	private toggleDrawer = (): void => {
		const { dispatchSetDrawerOpenAction } = this.props;
		const { drawerOpen } = this.state;
		dispatchSetDrawerOpenAction(!drawerOpen);
	}
}

export default hot(module)(withStyles(styles)(withRouter(diDecorator(FullscreenLayoutComponent)))) as any as React.ComponentType<IFullscreenLayoutExternalProps>;
