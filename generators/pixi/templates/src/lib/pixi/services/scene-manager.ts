import { inject } from 'lib/di';

import { IScene } from '../interfaces';

@inject([
	'pixi:scenes',
])
export class SceneManager {
	private scenes: { [key: string]: IScene } = {};
	private currentScene?: IScene;

	constructor(
		scenes: IScene[],
	) {
		scenes.forEach(this.registerScene.bind(this));
	}

	public registerScene(scene: IScene) {
		this.scenes[scene.name] = scene;
	}

	public async start(name: string) {
		if (this.currentScene) {
			await this.currentScene.exit();
		}

		this.currentScene = this.scenes[name];

		await this.currentScene.enter();
	}
}
