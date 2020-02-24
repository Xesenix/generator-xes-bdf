import PlayFab from 'playfab-web-sdk/src/PlayFab/PlayFabClientApi';

import { IApplication } from 'lib/interfaces';

/**
 *
 * @see https://api.playfab.com/docs/getting-started/javascript-getting-started
 */
export default class PlayfabModule {
	public static register(app: IApplication) {
		console.debug('PlayfabModule');

		PlayFab.settings.titleId = process.env.PLAYFAB_TITLE_ID;

		app.bind<PlayFab>('playfab').toConstantValue(PlayFab);

		app.bind('kongregate:authenticate:provider').toProvider(({ container }) => () => Promise.resolve(container.get<any>('playfab').ClientApi.LoginWithKongregate));
	}
}
