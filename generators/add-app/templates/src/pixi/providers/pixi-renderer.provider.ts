import { Application } from '@pixi/app';
import { SCALE_MODES } from '@pixi/constants';
import { BatchRenderer, Renderer } from '@pixi/core';
import { settings } from '@pixi/settings';
import { Container, interfaces } from 'inversify';

import { getDependencies } from 'lib/di';

let providerSingletonPromise: Promise<Application>;

export function PixiApplicationProvider({ container }: interfaces.Context) {
	const console: Console = container.get<Console>('debug:console:DEBUG_PIXI');
	console.debug('PixiApplicationProvider');

	return () => {
		if (!providerSingletonPromise) {
			providerSingletonPromise = Promise.resolve().then(async () => {
				console.debug('PixiApplicationProvider:provide');

				const [ plugins ] = await getDependencies(container as Container, [
					// prettier-ignore
					'pixi:plugins[]',
				]) as [Application.Plugin[]];

				plugins.forEach((plugin: Application.Plugin) => Application.registerPlugin(plugin));

				Renderer.registerPlugin('batch', BatchRenderer);

				settings.FILTER_RESOLUTION = 8;
				settings.SCALE_MODE = SCALE_MODES.NEAREST;

				const screenWidth = 800;
				const screenHeight = 600;

				return new Application({
					autoDensity: true,
					resolution: window.devicePixelRatio,
					width: screenWidth,
					height: screenHeight,
				});
			});
		}

		return providerSingletonPromise;
	};
}
