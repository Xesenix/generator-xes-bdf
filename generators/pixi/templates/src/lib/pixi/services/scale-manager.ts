import { Application } from '@pixi/app';
import { injectable } from 'lib/di';

import { IResizer } from '../interfaces';

@injectable()
export class ScaleManager {
	private scales: { [key: string]: IResizer } = {};
	private currentScale?: IResizer;

	public registerScale(name, plugin) {
		this.scales[name] = plugin;
	}

	public useScale(name) {
		if (!this.scales[name]) {
			throw new Error(`ScaleManagerPlugin:useScale cannot use not registered scale '${name}' `);
		}

		this.currentScale = this.scales[name];
	}

	public resize(app: Application): void {
		if (this.currentScale) {
			const element = app.view;

			if (element.parentElement) {
				element.style.width = '0px';
				element.style.height = '0px';

				this.currentScale(app);
			}
		}
	}

}
