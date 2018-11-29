import { IApplication } from 'lib/interfaces';

import { ISoundtrackPlayer } from './interfaces';
import { phaserSoundtrackManagerPluginProvider } from './phaser/soundtrack-manager-plugin.provider';
import { SoundtrackPlayer } from './services/soundtrack-player.service';

export class SoundScapeModule {
	public static register(app: IApplication) {
		app.bind<SoundScapeModule>('sound-scape:module').toConstantValue(new SoundScapeModule(app));
	}

	constructor(
		// prettier-ignore
		private app: IApplication,
	) {
		this.app
			.bind<ISoundtrackPlayer>('sound-scape:soundtrack-player')
			.to(SoundtrackPlayer)
			.inSingletonScope();

		this.app.bind('soundtrack-manager-plugin:provider').toProvider(phaserSoundtrackManagerPluginProvider);
	}
}
