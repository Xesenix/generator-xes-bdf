import produce, { createDraft, finishDraft } from 'immer';

import {
	// prettier-ignore
	DataStore,
	IGameState,
} from './store';

// prepare constant modifiers instead of recreating them with each method call

export class Game {
	constructor(
		// prettier-ignore
		private initialState: IGameState,
		private dataStore: DataStore<IGameState>,
	) {
		this.resetGame();
	}

	public resetGame = (): void => {
		this.dataStore.setState(produce(this.initialState, () => {}));
	}

	public getState(): IGameState {
		return produce(this.dataStore.getState(), () => {});
	}
}
