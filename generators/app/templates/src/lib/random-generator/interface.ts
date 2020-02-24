export type RandomGeneratorFactory = (seed: string) => () => number;

export interface IRandomGenerator<T = any> {
	/**
	 * Used to initialize random generator.
	 *
	 * @param seed random string used for generating numbers
	 */
	seed(seed: string): void;

	/**
	 * Generate next random <T>.
	 */
	next(): void;

	/**
	 * Get current generated <T>. Always returns same number until next will be used to generate new one.
	 */
	getValue(): T;

	/**
	 * Generates new random <T> and returns it.
	 */
	getNextValue(): T;
}
