import { IGameState } from 'game';

export const initialGameState: IGameState = {
	population: {
		current: 20,
		max: 20,
	},
	command: {
		train: { guards: 0, workers: 0 },
	},
	idles: {
		current: 20,
		killed: { current: 0, total: 0 },
	},
	guards: {
		current: 0,
		killed: { current: 0, total: 0 },
	},
	workers: {
		current: 0,
		killed: { current: 0, total: 0 },
	},
	children: {
		current: 0,
		killed: { current: 0, total: 0 },
	},
	resources: {
		amount: 0,
		reserved: 0,
		used: { current: 0, total: 0 },
		stolen: { current: 0, total: 0 },
	},
	cottages: {
		level: 1,
	},
	walls: {
		level: 0,
		perLevelReduction: 30,
		costMultiplier: 1.25,
	},
	sacrifice: {
		count: 0,
		cost: {
			resources: { current: 0, total: 0 },
			population: { current: 0, total: 0 },
		},
	},
	turn: 0,
	win: false,
	lose: false,
	event: 'orcs',
	weakness: {
		level: 0,
		perLevelReduction: 0.3,
	},
};
