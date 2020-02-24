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
		end: note140 * 56,
		duration: note140 * 56,
		interruptionStep: note140 * 2,
	},
	outro: {
		start: note140 * 0,
		end: note140 * 0,
		duration: note140 * 0,
	},
};

const action: ISoundtrack = {
	key: 'soundtrack',
	name: 'action',
	intro: {
		start: note140 * 56,
		end: note140 * 60,
		duration: note140 * 4,
	},
	loop: {
		start: note140 * 60,
		end: note140 * 88,
		duration: note140 * 28,
		interruptionStep: note140 * 4,
	},
	outro: {
		start: note140 * 88,
		end: note140 * 92,
		duration: note140 * 4,
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
		app.bind<ISoundtrack>('soundtrack').toConstantValue(action).whenTargetNamed('action');
	}
}
