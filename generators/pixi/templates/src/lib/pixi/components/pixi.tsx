import { Application } from '@pixi/app';
import * as React from 'react';
import { hot } from 'react-hot-loader';

import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';
import { IEventEmitter } from 'lib/interfaces';

import { useStyles } from './pixi.styles';

/** Component public properties required to be provided by parent component. */
export interface IPixiExternalProps {
}

/** Internal component properties include properties injected via dependency injection. */
interface IPixiInternalProps {
	__: II18nTranslation;
	pixi: Application;
	em: IEventEmitter;
}

type IPixiProps = IPixiExternalProps & IPixiInternalProps;

const diDecorator = connectToInjector<IPixiExternalProps, IPixiInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	pixi: {
		dependencies: ['pixi:application:provider()'],
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

	const container = React.useRef<HTMLDivElement>(null);

	React.useLayoutEffect(() => {
		if (container !== null && container.current) {
			container.current.append(pixi.view);
			em.emit('pixi:view:mounted', pixi);
		}

		return () => {
			if (container !== null) {
				if (pixi.view.parentElement) {
					pixi.view.parentElement.removeChild(pixi.view);
				}

				em.emit('pixi:view:dismounted', pixi);
			}
		};
	}, [container, em, pixi]);

	return <div className={classes.root} ref={container}/>;
}

export default hot(module)(diDecorator(PixiComponent));
