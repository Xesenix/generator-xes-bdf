import { Application } from '@pixi/app';

export interface IScene {
	name: string;
	enter: () => Promise<void>;
	exit: () => Promise<void>;
}

export interface ISceneManager {
	start(name: string): void;
}

export type IResizer = (app: Application) => void;

export interface IScaleManager {
	registerScale(name: string, resizer: IResizer): void;
	useScale(name: string): void;
	resize(app: Application): void;
}
