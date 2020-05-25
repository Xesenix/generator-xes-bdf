import { Application } from '@pixi/app';
import { AppLoaderPlugin } from '@pixi/loaders';
import { TickerPlugin } from '@pixi/ticker';
import { interfaces } from 'inversify';

import { IApplication } from 'lib/interfaces';
import { IScaleManager, IScene, ISceneManager } from 'lib/pixi/interfaces';
import { ScaleManagerPlugin } from 'lib/pixi/plugins/scale-manager';
import { ScaleManager } from 'lib/pixi/services/scale-manager';
import { SceneManager } from 'lib/pixi/services/scene-manager';

import { PixiBootProvider } from './providers/pixi-boot.provider';
import { PixiApplicationProvider } from './providers/pixi-renderer.provider';
import { IntroScene } from './scene/intro';

export default class PixiModule {
	public static register(app: IApplication) {
		// define logic needed to bootstrap module
		app.bind('boot').toProvider(PixiBootProvider);

		app.bind('pixi:plugins').to(ScaleManagerPlugin).whenTargetNamed('scale-manager');
		app.bind('pixi:plugins').toConstantValue(TickerPlugin).whenTargetNamed('ticker');
		app.bind('pixi:plugins').toConstantValue(AppLoaderPlugin).whenTargetNamed('loader');

		app.bind<Application>('pixi:application:provider').toProvider(PixiApplicationProvider);

		app.bind<IScaleManager>('pixi:scale-manager').to(ScaleManager).inSingletonScope();
		app.bind<ISceneManager>('pixi:scene-manager').to(SceneManager).inSingletonScope();

		app.bind<IScene>('pixi:scene').to(IntroScene).whenTargetNamed('intro');

		app.bind<IScene[]>('pixi:scenes')
			.toDynamicValue(({ container }: interfaces.Context) => container.getAll<IScene>('pixi:scene'));
	}
}
