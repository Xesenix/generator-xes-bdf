import { Application } from '@pixi/app';

import { injectable } from 'lib/di';

@injectable()
export abstract class BaseScene {
	protected app?: Application;
	private preloaded = false;

	constructor(
		private appProvider: () => Promise<Application>,
	) {
	}

	public async enter() {
		const app = this.app = (await this.appProvider()) as Application;

		if (!this.preloaded) {
			this.preload();
			await new Promise((resolve) => app.loader.load(resolve));
			this.preloaded = true;
		}

		this.build();
		this.update = this.update.bind(this);
		this.app.ticker.add(this.update);
	}

	public exit() {
		if (this.app) {
			this.app.ticker.remove(this.update);
		}
		this.destroy();

		return Promise.resolve();
	}

	protected preload() {}

	protected abstract build();

	protected abstract update(delta?: number);

	protected abstract destroy();
}
