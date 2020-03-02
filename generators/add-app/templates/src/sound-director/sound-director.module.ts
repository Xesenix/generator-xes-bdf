import { IApplication, IEventEmitter } from 'lib/interfaces';
import { ISoundtrack } from 'lib/sound-scape/interfaces';

import { SoundDirectorService } from './sound-director.service';

const note140 = 240 / 140;

const ambient: ISoundtrack = {
	key: 'soundtrack',
	name: 'ambient',
	intro: {
		start: note140 * 0,
		end: note140 * 0,
		duration: note140 * 0,
	},
	loop: {
		start: note140 * 0,
		end: note140 * 0,
		duration: note140 * 18,
		interruptionStep: note140 * 2,
	},
	outro: {
		start: note140 * 0,
		end: note140 * 0,
		duration: note140 * 0,
	},
};

export default class SoundDirectorModule {
	public static register(app: IApplication) {
		const console: Console = app.get<Console>('debug:console');
		console.debug('SoundDirectorModule:register');

		app.get<IEventEmitter>('event-manager').on('app:boot', () => {
			console.debug('SoundDirectorModule:initialize');
			const soundDirector = app.get<SoundDirectorService>('sound-director');
			soundDirector.start();
		});

		app.bind<SoundDirectorService>('sound-director').to(SoundDirectorService);
		app.bind<ISoundtrack>('soundtrack').toConstantValue(ambient).whenTargetNamed('ambient');
	}
}
