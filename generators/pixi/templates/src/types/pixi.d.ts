declare module '@pixi/app' {
	export { Application } from 'pixi.js';
}

declare module '@pixi/constants' {
	export { SCALE_MODES } from 'pixi.js';
}

declare module '@pixi/display' {
	export { Container } from 'pixi.js';
}

declare module '@pixi/graphics' {
	export { Graphics } from 'pixi.js';
}

declare module '@pixi/sprite' {
	export { Sprite } from 'pixi.js';
}

declare module '@pixi/math' {
	export { Matrix, Point } from 'pixi.js';
}

// for nested namespaces
declare module '@pixi/interaction' {
	import { interaction } from 'pixi.js';
	export import InteractionManager = interaction.InteractionManager;
}
