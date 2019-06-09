import { withStyles, WithStyles } from '@material-ui/core/styles';
import { EventEmitter } from 'events';
import { Container } from 'inversify';
import * as React from 'react';
import { hot } from 'react-hot-loader';

import { Game } from 'game/game';
import { IGameState } from 'game/store';
import { connectToInjector } from 'lib/di';
import {
	// prettier-ignore
	II18nLanguagesState,
	II18nPluralTranslation,
	II18nTranslation,
} from 'lib/i18n';
import { LanguageType } from 'lib/interfaces';

// elements<% if (usePhaser) { %>
import PhaserViewComponent from 'components/phaser-view/phaser-view';<% } %>

import { styles } from './game-view.styles';

/** Component public properties required to be provided by parent component. */
export interface IGameViewExternalProps {
	compact: boolean;
}

/** Internal component properties include properties injected via dependency injection. */
interface IGameViewInternalProps {
	__: II18nTranslation;
	_$: II18nPluralTranslation;
	bindToStore: (keys: (keyof IGameViewState)[]) => IGameViewState;
	di?: Container;
	em: EventEmitter;
	game: Game;
}

/** Internal component state. */
interface IGameViewState {
	currentState: IGameState | null;
	/** required for interface updates after changing application language */
	language: LanguageType;
	/** required for interface updates after loading language */
	languages: II18nLanguagesState;
}

type IGameViewProps = IGameViewExternalProps & IGameViewInternalProps & WithStyles<typeof styles>;

const diDecorator = connectToInjector<IGameViewProps, IGameViewInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	_$: {
		dependencies: ['i18n:translate_plural'],
	},
	bindToStore: {
		dependencies: ['data-store:bind'],
	},
	em: {
		dependencies: ['event-manager'],
	},
	game: {
		dependencies: ['game'],
	},
});

function GameViewComponent(props: IGameViewProps) {
	const { bindToStore, em, game } = props;
	const { currentState } = bindToStore([
		// prettier-ignore
		'language',
		'languages',
		'currentState',
	]);
	const [state, setState] = React.useState(currentState);

	React.useEffect(() => {
		let unsubscribeEventManager: () => void = () => {};
		if (em) {
			const handle = (nextState: IGameState) => {
				setState(nextState);
			};
			// handle game state change
			em.addListener('state:update', handle);
			unsubscribeEventManager = () => {
				em.removeListener('state:update', handle);
			};
		}
		return unsubscribeEventManager;
	}, [em]);

	return <><% if (usePhaser) { %><PhaserViewComponent keepInstanceOnRemove /><% } else { %>#GAME<% } %></>;
}

export default hot(module)(withStyles(styles)(diDecorator(GameViewComponent)));
