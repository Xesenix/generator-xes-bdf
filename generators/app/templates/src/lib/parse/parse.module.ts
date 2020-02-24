import Parse from 'parse/node';

import { IApplication } from 'lib/interfaces';

export default class ParseModule {
	public static register(app: IApplication) {
		Parse.initialize(process.env.PARSE_APP_ID, process.env.PARSE_JS_KEY);
		Parse.serverURL = 'https://parseapi.back4app.com/';

		app.bind<Parse>('parse').toConstantValue(Parse);
	}
}
