import { Application } from '@pixi/app';

import { inject } from 'lib/di/decorators';
import { IEventEmitter } from 'lib/interfaces';

@inject([
	'event-manager',
	'window',
])
export class ScaleManagerPlugin {
	// tslint:disable:ban-types
	public init: Function;
	// tslint:disable:ban-types
	public destroy: Function;

	constructor(
		em: IEventEmitter,
		window: Window,
	) {
		// this functions will get bind into Application scope loosing reference to original this
		// tslint:disable:only-arrow-functions
		this.init = function ({ scaling, width, height }: any) {
			const app: Application = this;

			em.on('pixi:view:mounted', () => {
				scaling(app, window.innerWidth, window.innerHeight, width, height);
			});

			window.addEventListener('resize', (event) => {
				const { innerWidth, innerHeight } = event.currentTarget;
				scaling(app, innerWidth, innerHeight, width, height);
			});
		};

		// tslint:disable:only-arrow-functions
		this.destroy = function() {};
	}
}
