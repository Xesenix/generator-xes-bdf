import { interfaces as inversifyInterfaces } from 'inversify';

import { annotate } from './annotate';
import * as interfaces from './interfaces';
import {
	register,
	registerAutoFactory,
	registerConstantValue,
	registerConstructor,
	registerDynamicValue,
	registerFactory,
	registerFunction,
	registerProvider,
	registerSelf,
} from './register';

const helpers = {
	annotate,
	register,
	registerAutoFactory,
	registerConstantValue,
	registerConstructor,
	registerDynamicValue,
	registerFactory,
	registerFunction,
	registerProvider,
	registerSelf,
};

export { interfaces, inversifyInterfaces, helpers };
