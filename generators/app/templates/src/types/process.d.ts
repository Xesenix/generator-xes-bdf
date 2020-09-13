declare namespace NodeJS {
	// tslint:disable:interface-name
	export interface ProcessEnv {
		APP: {
			templateData: {
				author: string;
				title: string;
			};
		};
		ENV: 'development' | 'production';
		DI: 'true' | 'false';
		DEBUG: 'true' | 'false';
		DEBUG_DI: 'true' | 'false';
		DEBUG_PHASER_SOUND: 'true' | 'false';
		DEBUG_PHASER: 'true' | 'false';
		DEBUG_PIXI: 'true' | 'false';
		DEBUG_REDUX: 'true' | 'false';
		DEBUG_SOUND: 'true' | 'false';
		DEBUG_STORE: 'true' | 'false';
		SERVICE_WORKER: 'true' | 'false';
		LOCALES_DIR: string;
		PACKAGE: {
			version: string;
		};
	}
}
