import * as React from 'react';
import { hot } from 'react-hot-loader';

import { Application } from '@pixi/app';
import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';

import { useStyles } from './pixi.styles';

/** Component public properties required to be provided by parent component. */
export interface IPixiExternalProps {
}

/** Internal component properties include properties injected via dependency injection. */
interface IPixiInternalProps {
	__: II18nTranslation;
	pixi: Application;
}

type IPixiProps = IPixiExternalProps & IPixiInternalProps;

const diDecorator = connectToInjector<IPixiExternalProps, IPixiInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	pixi: {
		dependencies: ['pixi:provider()'],
	},
	em: {
		dependencies: ['event-manager'],
	},
});

function PixiComponent(props: IPixiProps): React.ReactElement {
	const {
		// prettier-ignore
		pixi,
		em,
	} = props;
	const classes = useStyles();

	const canvas = React.useRef<HTMLDivElement>(null);

	React.useLayoutEffect(() => {
		if (canvas !== null) {
			canvas.current.append(pixi.view);
			em.emit('pixi:view:mounted', pixi);
		}

		return () => {
			if (canvas !== null) {
				canvas.current.remove(pixi.view);
				em.emit('pixi:view:dismounted', pixi);
			}
		};
	}, [canvas, em, pixi]);

	return <div className={classes.root} ref={canvas}/>;
}

export default hot(module)(diDecorator(PixiComponent));
