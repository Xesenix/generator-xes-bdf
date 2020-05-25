import { Application } from '@pixi/app';

import { inject } from 'lib/di/decorators';
import { IEventEmitter } from 'lib/interfaces';

import { IScaleManager } from '../interfaces';

@inject([
	'event-manager',
	'window',
	'pixi:scale-manager',
])
export class ScaleManagerPlugin {
	// tslint:disable:ban-types
	public init: Function;
	public destroy: Function;

	constructor(
		em: IEventEmitter,
		window: Window,
		scaleManager: IScaleManager,
	) {
		console.log('ScaleManagerPlugin');
		let onResize: () => void;

		// this functions will get bind into Application scope loosing reference to original this
		// tslint:disable:only-arrow-functions
		this.init = function (this: Application) {
			console.log('ScaleManagerPlugin:init', scaleManager);
			const app: Application = this;
			onResize = () => scaleManager.resize(app);

			em.on('pixi:view:mounted', () => {
				console.log('ScaleManagerPlugin:mounted');
				window.addEventListener('resize', onResize);

				onResize();
			});

			em.on('pixi:view:dismounted', () => {
				console.log('ScaleManagerPlugin:dismounted');
				window.removeEventListener('resize', onResize);
			});
		};

		// tslint:disable:only-arrow-functions
		this.destroy = function() {
			em.removeListener('pixi:view:mounted', onResize);
			window.removeEventListener('resize', onResize);
		};
	}
}
