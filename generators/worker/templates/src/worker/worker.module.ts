import { IApplication } from 'lib/interfaces';

import Worker from 'worker-loader!./worker';

export default class MapWorkerModule {
	public static register(app: IApplication) {
		const worker = new Worker();
		app.bind('worker').toConstantValue(worker);
	}
}
