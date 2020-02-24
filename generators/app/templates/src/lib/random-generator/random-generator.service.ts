import { inject } from 'lib/di';
import { IRandomGenerator } from './interface';

@inject([
	'random-generator:random-number-generator-factory',
	'random-generator:default-seed',
])
export class RandomGeneratorService implements IRandomGenerator<number> {
	private currentValue: number = 0;
	private randomGenerator: () => number = (() => 0);

	constructor(
		private randomGeneratorFactory: (seed: string) => () => number,
		seed: string,
	) {
		this.seed(seed);
	}

	public seed(seed: string): void {
		this.randomGenerator = this.randomGeneratorFactory(seed);
		this.next();
	}

	public getValue(): number {
		return this.currentValue;
	}

	public getNextValue(): number {
		this.next();

		return this.currentValue;
	}

	public next(): RandomGeneratorService {
		this.currentValue = this.randomGenerator();

		return this;
	}
}
