import { Application } from '@pixi/app';
import { IApplication } from 'lib/interfaces';

import { PixiRendererProvider } from './pixi-renderer.provider';
import { ScaleManagerPlugin } from './plugins/scale-manager';

export default class PixiModule {
	public static register(app: IApplication) {
		app.bind<Application>('pixi:provider').toProvider(PixiRendererProvider);
		app.bind<Application>('pixi:scale-manager-plugin').to(ScaleManagerPlugin);
	}
}
