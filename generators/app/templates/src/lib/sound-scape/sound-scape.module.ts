import { IApplication } from 'lib/interfaces';

import { ISoundtrackPlayer } from './interfaces';
import { SoundtrackPlayer } from './services/soundtrack-player.service';

export default class SoundScapeModule {
	public static register(app: IApplication) {
		app
			.bind<ISoundtrackPlayer>('sound-scape:soundtrack-player')
			.to(SoundtrackPlayer)
			.inSingletonScope();
	}
}
