import 'reflect-metadata';

import BaseAppModule from 'lib/core/base-app.module';
import { IApplication, IRegistrable } from 'lib/interfaces';

/**
 * Main module for application. Defines all dependencies and provides default setup for configuration variables.
 *
 * @export
 * @extends {Container}
 */
export default class AppModule extends BaseAppModule implements IApplication {
	protected getDependencies(): Promise<{ default: IRegistrable }[]> {
		return Promise.all<{ default: IRegistrable }>([
			import('i18n/i18n.module'),
			import(/* webpackChunkName: "ui" */ 'lib/data-store/data-store.module'),
			import(/* webpackChunkName: "ui" */ 'lib/i18n/i18n.module'),
			import(/* webpackChunkName: "ui" */ 'ui/ui.module'),<% if (addLayout) { %>
			import(/* webpackChunkName: "ui" */ 'lib/fullscreen/fullscreen.module'),
			import(/* webpackChunkName: "ui" */ 'theme/theme.module'),
			import(/* webpackChunkName: "ui" */ 'themes/default/default-theme.module'),<% } %><% if (usePhaser) { %>
			import(/* webpackChunkName: "phaser" */ 'phaser/phaser.module'),<% } %><% if (usePixi) { %>
			import(/* webpackChunkName: "pixi" */ 'pixi/pixi.module'),<% } %><% if (useSound) { %>
			import(/* webpackChunkName: "audio" */ 'lib/audio/audio.module'),
			import(/* webpackChunkName: "audio" */ 'lib/audio/audio-loader.module'),
			import(/* webpackChunkName: "audio" */ 'lib/sound-scape/sound-scape.module'),
			import(/* webpackChunkName: "audio" */ 'sound-director/sound-director.module'),<% } %>
		] as any);
	}

	protected start(): Promise<{ default: any }> {
		return import(/* webpackChunkName: "app" */ './app');
	}
}
