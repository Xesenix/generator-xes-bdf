import * as React from 'react';
import { hot } from 'react-hot-loader';

import Slider from '@material-ui/core/Slider';

import { connectToInjector } from 'lib/di';

/** Component public properties required to be provided by parent component. */
export interface IEffectsVolumeExternalProps {
}

/** Internal component properties include properties injected via dependency injection. */
interface IEffectsVolumeInternalProps {
	dispatchSetEffectsVolumeAction: (event: any, value: number) => void;
	bindToStore: (keys: (keyof IEffectsVolumeState)[]) => IEffectsVolumeState;
}

/** Internal component state. */
interface IEffectsVolumeState {
	effectsVolume: number;
}

const diDecorator = connectToInjector<IEffectsVolumeExternalProps, IEffectsVolumeInternalProps>({
	dispatchSetEffectsVolumeAction: {
		dependencies: ['ui:actions@setEffectsVolume'],
		value: (setEffectsVolume: (value: number) => void) => Promise.resolve((event: any, value: number) => setEffectsVolume(value)),
	},
	bindToStore: {
		dependencies: ['data-store:bind'],
	},
});

type IEffectsVolumeProps = IEffectsVolumeExternalProps & IEffectsVolumeInternalProps;

function EffectsVolumeComponent(props: IEffectsVolumeProps) {
	const {
		// prettier-ignore
		dispatchSetEffectsVolumeAction,
		bindToStore,
	} = props;
	const {
		// prettier-ignore
		effectsVolume,
	} = bindToStore([
		// prettier-ignore
		'effectsVolume',
	]);

	return (
		<Slider
			max={1}
			min={0}
			onChange={dispatchSetEffectsVolumeAction as any}
			step={1 / 32}
			value={effectsVolume}
		/>
	);
}

export default hot(module)(diDecorator(EffectsVolumeComponent));
