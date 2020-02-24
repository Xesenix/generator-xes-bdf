import { Container } from 'inversify';

import { inject, injectable } from './decorators';

// tslint:disable:max-classes-per-file

describe('di/decorators', () => {
	describe('inject', () => {
		it('should correctly inject constants', () => {
			class A {
				constructor(
					public x: any,
				) {
				}
			}

			const container = new Container();

			inject(['a'])(A);

			const injectedValue = 'Hello world';

			container.bind<string>('a').toConstantValue(injectedValue);
			container.bind<A>('tested').to(A);

			const tested = container.get<A>('tested');

			expect(tested instanceof A).toBe(true, 'to be of class A');
			expect(tested.x).toBe(injectedValue);
		});

		it('should correctly inject constants when used as decorator', () => {
			@inject(['a'])
			class A {
				constructor(
					public x: any,
				) {
				}
			}

			const container = new Container();

			const injectedValue = 'Hello world';

			container.bind<string>('a').toConstantValue(injectedValue);
			container.bind<A>('tested').to(A);

			const tested = container.get<A>('tested');

			expect(tested instanceof A).toBe(true, 'to be of class A');
			expect(tested.x).toBe(injectedValue);
		});
	});

	describe('injectable', () => {
		it('should correctly be instatiedted when injected', () => {
			class A {
				constructor(
					public x: any,
				) {
				}
			}

			class B {
			}

			const container = new Container();

			inject(['tested'])(A);
			injectable()(B);

			container.bind<B>('tested').to(B);
			container.bind<A>('a').to(A);

			const injected = container.get<A>('a');

			expect(injected.x instanceof B).toBe(true, 'injection to be of class A');
		});

		it('should correctly be instatiedted when injected when used as decorator', () => {
			@inject(['tested'])
			class A {
				constructor(
					public x: any,
				) {
				}
			}

			@injectable()
			class B {
			}

			const container = new Container();

			container.bind<B>('tested').to(B);
			container.bind<A>('a').to(A);

			const injected = container.get<A>('a');

			expect(injected.x instanceof B).toBe(true, 'injection to be of class A');
		});
	});
});
