import { IApplication } from 'lib/interfaces';

import { AclService } from './acl.service';

export default class AclModule {
	public static register(app: IApplication) {
		app.bind<AclService>('acl').to(AclService).inSingletonScope();
	}
}
