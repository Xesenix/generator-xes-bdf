import { createClassProvider } from 'lib/di';
import { ISoundtrackPlayer } from 'lib/sound-scape/interfaces';

// prettier-ignore
export const PhaserSoundtrackManagerPluginProvider = createClassProvider('phaser-soundtrack-manager-plugin', [
	// prettier-ignore
	'phaser:provider()',
	'sound-scape:soundtrack-player',
	'debug:console:DEBUG_SOUND',
], (
	// prettier-ignore
	Phaser,
	soundtrackPlayer: ISoundtrackPlayer,
	console: Console,
) => class PhaserSoundtrackManagerPlugin extends Phaser.Plugins.BasePlugin {
	public soundtrackPlayer: ISoundtrackPlayer = soundtrackPlayer;

	constructor(
		// prettier-ignore
		public pluginManager: Phaser.Plugins.PluginManager,
	) {
		super(pluginManager);
		console.log('PhaserSoundtrackManagerPlugin:constructor');
	}

	public start(): void {
		console.log('PhaserSoundtrackManagerPlugin:start', this);
	}

	public stop() {
		console.log('PhaserSoundtrackManagerPlugin:stop');
	}
});
