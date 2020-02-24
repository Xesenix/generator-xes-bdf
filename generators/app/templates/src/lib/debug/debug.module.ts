import { Container } from 'inversify';

export default class DebugModule {
	public static register(container: Container) {
		// console
		const noop = () => {};
		const noopConsole = {
			assert: noop,
			debug: noop,
			error: noop,
			log: noop,
			trace: noop,
			group: noop,
			groupEnd: noop,
		} as Console;

		/**
		 * Extracted environmental setup for debuging as process.env.KEY is replaced during build and not available as object after that.
		 */
		const debugConfig = {
			DEBUG_REDUX: process.env.DEBUG_REDUX,
			DEBUG_DI: process.env.DEBUG_DI,
			DEBUG_STORE: process.env.DEBUG_STORE,
			DEBUG_PHASER: process.env.DEBUG_PHASER,
			DEBUG_PHASER_SOUND: process.env.DEBUG_PHASER_SOUND,
			DEBUG_SOUND: process.env.DEBUG_SOUND,
		};

		Object.entries(debugConfig).forEach(([key, value]) => {
			container.bind<Console>(`debug:console:${key}`).toConstantValue(process.env.DEBUG === 'true' && value === 'true' ? console : noopConsole);
		});

		container.bind<Console>('debug:console').toConstantValue(process.env.DEBUG === 'true' ? console : noopConsole);
	}
}
