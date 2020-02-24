import * as seed from 'math-random-seed';

import { IApplication } from 'lib/interfaces';

import {
	IRandomGenerator,
	RandomGeneratorFactory,
} from './interface';
import { RandomGeneratorService } from './random-generator.service';

export default class RandomGeneratorModule {
	public static register(app: IApplication) {
		app.bind<string>('random-generator:default-seed').toConstantValue('');
		app.bind<RandomGeneratorFactory>('random-generator:random-number-generator-factory').toFunction(seed);
		app.bind<IRandomGenerator>('random-generator:random-number-service').to(RandomGeneratorService);
	}
}
