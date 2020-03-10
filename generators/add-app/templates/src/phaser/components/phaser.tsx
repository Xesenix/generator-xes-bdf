import { withStyles, WithStyles } from '@material-ui/core';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';

import { connectToDI } from 'lib/di';
import { IPhaserGameProvider } from 'phaser/phaser-game.provider';

import { styles } from './phaser.styles';

let game: Phaser.Game | null;
let gameContainer: HTMLDivElement | null;

/** Component public properties required to be provided by parent component. */
export interface IPhaserExternalProps {
	keepInstanceOnRemove: boolean;
}

/** Internal component properties include properties injected via dependency injection. */
interface IPhaserInternalProps {
	di: Container | null;
}

/** Internal component state. */
interface IPhaserState {}

type IPhaserProps = IPhaserExternalProps & IPhaserInternalProps & WithStyles<typeof styles>;

class PhaserComponent extends React.PureComponent<IPhaserProps, IPhaserState> {
	constructor(props) {
		super(props);
		this.state = {};
	}

	public componentDidMount(): void {
		const { di } = this.props;

		if (!!di && !!gameContainer) {
			di.bind<HTMLElement | null>('phaser:container').toDynamicValue(() => gameContainer);
			di.get<IPhaserGameProvider>('phaser:game-provider')().then((result: Phaser.Game) => {
				game = result;
			});
		}
	}

	public componentWillUnmount(): void {
		const { di } = this.props;

		if (!!gameContainer) {
			if (!!game) {
				gameContainer.removeChild(game.canvas);
			}
			gameContainer = null;
		}

		if (!!di) {
			di.unbind('phaser:container');
		}
	}

	public render(): any {
		const { classes } = this.props;

		return (<div className={classes.root} ref={this.bindContainer} />);
	}

	private bindContainer = (el: HTMLDivElement): void => {
		gameContainer = el;
	}
}

export default hot(module)(withStyles(styles)(connectToDI(PhaserComponent)));
