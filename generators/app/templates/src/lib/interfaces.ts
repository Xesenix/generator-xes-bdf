import { Container } from 'inversify';
import { Action } from 'redux';

/**
 * Application dependency container augmented with booting and application starting logic.
 */
export interface IApplication extends Container {
	/** Run all dependencies defined on container `boot:provider` key. */
	boot(): Promise<void[]>;
	/** Initialize application view after booting all dependencies. */
	run(): Promise<IApplication>;
}

export interface IRegistrable {
	register: (app?: IApplication) => void;
}

export interface IValueAction<T> extends Action {
	value: T;
}

export type ICreateSetAction<T> = (value: T) => IValueAction<T>;

export interface IEventEmitter {
	emit<T = string>(name: T, payload?: any): void;
	once<T = string>(name: T, cb: (...params: any[]) => any, context?: any): void;
	on<T = string>(name: T, cb: (...params: any[]) => any, context?: any): void;
	addEventListener<T = string>(name: T, cb: (...params: any[]) => any);
	removeEventListener(cb: (...params: any[]) => any): void;
	removeListener<T = string>(name: T, cb: (...params: any[]) => any, context?: any): void;
}

export type LanguageType = 'en' | 'pl';
