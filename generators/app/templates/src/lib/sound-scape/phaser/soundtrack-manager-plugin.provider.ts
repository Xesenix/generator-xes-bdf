import { interfaces } from 'inversify';
import { IAudioFileLoaderProvider } from 'lib/sound';

import { ISoundtrackPlayer } from '../interfaces';

import { phaserSoundtrackManagerPluginFactory } from './soundtrack-manager.plugin';

export const phaserSoundtrackManagerPluginProvider = (context: interfaces.Context) => () =>
	context.container.get<IAudioFileLoaderProvider>('audio-loader:provider')().then(() =>
		phaserSoundtrackManagerPluginFactory(context.container.get<ISoundtrackPlayer>('sound-scape:soundtrack-player')),
	);
