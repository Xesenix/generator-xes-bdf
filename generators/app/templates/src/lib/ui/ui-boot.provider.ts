import { interfaces } from 'inversify';
import { Store } from 'redux';

import { ICreateSetAction } from '../interfaces';

export function UIBootProvider({ container }: interfaces.Context) {
	const console: Console = container.get<Console>('debug:console');
	console.debug('UIBootProvider');

	return () => container.get<() => Promise<Store<any, any>>>('data-store:provider')()
		.then((store: Store<any, any>) => {
			console.debug('UIBootProvider:boot');

			const createSetMutedAction = container.get<ICreateSetAction<boolean>>('data-store:action:create:set-muted');
			container.bind('ui:actions')
				.toConstantValue((value: boolean) => store.dispatch(createSetMutedAction(value)))
				.whenTargetNamed('setMuted');

			const createSetMusicMutedAction = container.get<ICreateSetAction<boolean>>('data-store:action:create:set-music-muted');
			container.bind('ui:actions')
				.toConstantValue((value: boolean) => store.dispatch(createSetMusicMutedAction(value)))
				.whenTargetNamed('setMusicMuted');

			const createSetEffectsMutedAction = container.get<ICreateSetAction<boolean>>('data-store:action:create:set-effects-muted');
			container.bind('ui:actions')
				.toConstantValue((value: boolean) => store.dispatch(createSetEffectsMutedAction(value)))
				.whenTargetNamed('setEffectsMuted');

			const createSetPausedAction = container.get<ICreateSetAction<boolean>>('data-store:action:create:set-paused');
			container.bind('ui:actions')
				.toConstantValue((value: boolean) => store.dispatch(createSetPausedAction(value)))
				.whenTargetNamed('setPaused');

			const createSetVolumeAction = container.get<ICreateSetAction<number>>('data-store:action:create:set-volume');
			container.bind('ui:actions')
				.toConstantValue((value: number) => store.dispatch(createSetVolumeAction(value)))
				.whenTargetNamed('setVolume');

			const createSetEffectsVolumeAction = container.get<ICreateSetAction<number>>('data-store:action:create:set-effects-volume');
			container.bind('ui:actions')
				.toConstantValue((value: number) => store.dispatch(createSetEffectsVolumeAction(value)))
				.whenTargetNamed('setEffectsVolume');

			const createSetMusicVolumeAction = container.get<ICreateSetAction<number>>('data-store:action:create:set-music-volume');
			container.bind('ui:actions')
				.toConstantValue((value: number) => store.dispatch(createSetMusicVolumeAction(value)))
				.whenTargetNamed('setMusicVolume');
		});
}
