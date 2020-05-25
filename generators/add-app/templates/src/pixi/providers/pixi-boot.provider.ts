import { Application } from '@pixi/app';
import { interfaces } from 'inversify';

import { IScaleManager, ISceneManager } from 'lib/pixi/interfaces';
import { coverParent } from 'lib/pixi/scaling/cover-parent';
import { coverParentKeepAspectRatio } from 'lib/pixi/scaling/cover-parent-keep-aspect-ratio';
import { fitParentKeepAspectRatio } from 'lib/pixi/scaling/fit-parent';

export function PixiBootProvider({ container }: interfaces.Context) {
	const console: Console = container.get<Console>('debug:console');
	console.debug('PixiBootProvider');

	return async () => {
		const scaleManager = container.get<IScaleManager>('pixi:scale-manager');

		scaleManager.registerScale('coverParentKeepAspectRatio', coverParentKeepAspectRatio);
		scaleManager.registerScale('fitParentKeepAspectRatio', fitParentKeepAspectRatio);
		scaleManager.registerScale('coverParent', coverParent);
		scaleManager.useScale('fitParentKeepAspectRatio');

		await container.get<() => Promise<Application>>('pixi:application:provider')();

		const sceneManager = container.get<ISceneManager>('pixi:scene-manager');

		sceneManager.start('intro');
	};
}
