import { Application } from '@pixi/app';
import { interfaces } from 'inversify';

import { SCALE_MODES } from '@pixi/constants';
import { BatchRenderer, Renderer } from '@pixi/core';
import { AppLoaderPlugin } from '@pixi/loaders';
import { settings } from '@pixi/settings';
import { TickerPlugin } from '@pixi/ticker';

import { createClassProvider } from 'lib/di';

import { ScaleManagerPlugin } from './plugins/scale-manager';
import IntroScene from './scene/intro';

function scaleToFitWidth(element, innerWidth, innerHeight, screenWidth, screenHeight) {
	element.style.width = '0px';
	element.style.height = '0px';

	if (element.parentElement) {
		const width = Math.min(element.parentElement.clientWidth, innerWidth);
		element.style.width = width + 'px';
		element.style.height = Math.floor(screenHeight / screenWidth * width) + 'px';
	} else {
		const width = Math.min(screenWidth, innerWidth);
		element.style.width = screenWidth + 'px';
		element.style.height = Math.floor(screenHeight / screenWidth * width) + 'px';
	}
}

// singleton
let app: Application;

export function PixiRendererProvider(context: interfaces.Context) {
	const console: Console = context.container.get<Console>('debug:console:DEBUG_PIXI');
	console.debug('PixiRendererProvider');

	return () => {
		console.debug('PixiRendererProvider:provide');
		if (app) {
			return app;
		}

		return createClassProvider('phaser:game', [
			// prettier-ignore
			'pixi:scale-manager-plugin',
		], async (scaleManagerPlugin: ScaleManagerPlugin) => {

			Renderer.registerPlugin('batch', BatchRenderer);
			Application.registerPlugin(TickerPlugin);
			Application.registerPlugin(AppLoaderPlugin);
			Application.registerPlugin(scaleManagerPlugin);

			settings.FILTER_RESOLUTION = 8;
			settings.SCALE_MODE = SCALE_MODES.NEAREST;

			const screenWidth = 800;
			const screenHeight = 600;

			app = new Application({
				autoResize: true,
				resolution: window.devicePixelRatio,
				// custom
				scaling: scaleToFitWidth,
				width: screenWidth,
				height: screenHeight,
			});

			app.renderer.backgroundColor = 0x340000;

			app.loader.add('logo', './assets/thumb.png');

			IntroScene(app);

			return app;
		})(context)();
	};
}
