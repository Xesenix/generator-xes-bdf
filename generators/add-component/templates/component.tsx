import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';

// elements
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
// ...

// icons
import ConfigIcon from '@material-ui/icons/Build';

import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Store } from 'redux';

import {
	defaultUIState,
	IUIState,
} from 'game-01/src/ui';
import { IDataStoreProvider } from 'lib/data-store';
import { connectToInjector } from 'lib/di';
import { __ } from 'lib/i18n';
import { IValueAction } from 'lib/interfaces';

// loaders for subcomponents
import Loadable from 'react-loadable';

const Loader = () => <LinearProgress/>;

const SubComponent = Loadable({ loading: Loader, loader: () => import('path/to/component') });
// ...

// styling with JSS
const styles = (theme: Theme) => createStyles({
	root: {
		padding: '0',
	},
});

export interface I<%= name % > Props; {
	di ? : Container;
	store ? : Store<IUIState>;
}

export interface I<%= name % > State; {
	tab: 'configuration' | 'game';
	loading: boolean;
}

class <%= name % > Component; extends React.PureComponent < I < ;%= name % > Props & WithStyles < typeof styles > , I < ;%= name % > State & IUIState > {
	private unsubscribe?: any;

	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			...defaultUIState,
		};
	}

	public componentDidMount(): void {
		this.bindToStore();

		// optional preloading
		// this.setState({ loading: true });
		// import('dependency').then(() => this.setState({ loading: false }));
	}

	public componentDidUpdate(): void {
		this.bindToStore();
	}

	public componentWillUnmount(): void {
		if (this.unsubscribe) {
			this.unsubscribe();
		}
	}

	public render(): any {
		const { loading } = this.state;
		const { classes } = this.props;

		return (
			<Grid container spacing={ 0 } alignItems="center">
				<Grid item xs={ 12 }>
					<Paper className={ classes.root } elevation={ 2 }>
						<ConfigIcon />
						<SubComponent />
					</Paper>
				</Grid>
			</Grid>);
	}

	private bindToStore(): void {
		const { store } = this.props;

		if (!this.unsubscribe && store) {
			this.unsubscribe = store.subscribe(() => {
				if (store) {
					this.setState(store.getState());
				}
			});
			this.setState(store.getState());
		}
	},
};

export default hot(module)(connectToInjector < I < %= name % > Props > ({
	'data-store:provider': {
		name: 'store',
		value: (provider: IDataStoreProvider<IUIState, IValueAction>) => provider(),
	},
})(withStyles(styles)( < %= name % > Component)));
