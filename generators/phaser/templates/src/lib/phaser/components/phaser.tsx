import * as React from 'react';
import { hot } from 'react-hot-loader';

import { connectToInjector } from 'lib/di';
import { II18nTranslation } from 'lib/i18n';
import { IEventEmitter } from 'lib/interfaces';

import { useStyles } from './phaser.styles';

/** Component public properties required to be provided by parent component. */
export interface IPhaserExternalProps {
}

/** Internal component properties include properties injected via dependency injection. */
interface IPhaserInternalProps {
	__: II18nTranslation;
	app: Phaser.Game;
	em: IEventEmitter;
}

type IPhaserProps = IPhaserExternalProps & IPhaserInternalProps;

const diDecorator = connectToInjector<IPhaserExternalProps, IPhaserInternalProps>({
	__: {
		dependencies: ['i18n:translate'],
	},
	app: {
		dependencies: ['phaser:application:provider()'],
	},
	em: {
		dependencies: ['event-manager'],
	},
});

function PhaserComponent(props: IPhaserProps): React.ReactElement {
	const {
		// prettier-ignore
		app,
		em,
	} = props;
	const classes = useStyles();

	const container = React.useRef<HTMLDivElement>(null);

	React.useLayoutEffect(() => {
		if (container !== null && container.current) {
			container.current.append(app.canvas);
			em.emit('phaser:view:mounted', app);
		}

		return () => {
			if (container !== null) {
				if (container.current) {
					container.current.remove();
				}
				em.emit('phaser:view:dismounted', app);
			}
		};
	}, [container, em, app]);

	return <div className={classes.root} ref={container}/>;
}

export default hot(module)(diDecorator(PhaserComponent));
