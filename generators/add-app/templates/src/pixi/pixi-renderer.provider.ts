import { Application } from '@pixi/app';
import { interfaces } from 'inversify';

import { Renderer } from '@pixi/core'; // Renderer is the class that is going to register plugins
import { BatchRenderer } from '@pixi/core'; // BatchRenderer is the "plugin" for drawing sprites
import { TickerPlugin } from '@pixi/ticker'; // TickerPlugin is the plugin for running an update loop (it's for the application class)
// And just for convenience let's register Loader plugin in order to use it right from Application instance like app.loader.add(..) etc.
import { AppLoaderPlugin } from '@pixi/loaders';
import { settings } from '@pixi/settings';
import { ALPHA_MODES, FORMATS, MIPMAP_MODES, SCALE_MODES, TARGETS, TYPES, WRAP_MODES } from '@pixi/constants';

import { createClassProvider } from 'lib/di';

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
	}
}
