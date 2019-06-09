import { IEventEmitter } from 'lib/interfaces';

export interface IGameState {
}

export class DataStore<T> {
	constructor(
		// prettier-ignore
		private state: T,
		private em: IEventEmitter,
	) {
	}

	public setState = (change: Partial<T>) => {
		this.state = { ...(this.state as any), ...(change as any) };
		this.em.emit('state:update', this.state);
	}

	public getState = () => {
		return this.state;
	}
}
