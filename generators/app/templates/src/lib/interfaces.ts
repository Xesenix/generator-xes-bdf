import { EventEmitter } from 'events';
import { Container } from 'inversify';
import { Action } from 'redux';

export interface IApplication extends Container {
	eventManager: EventEmitter;

	boot: () => Promise<IApplication>;
}

export interface IValueAction<T> extends Action {
	value: T;
}

export type ICreateSetAction<T> = (value: T) => IValueAction<T>;
