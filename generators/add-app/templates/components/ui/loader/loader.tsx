import * as React from 'react';
import { hot } from 'react-hot-loader';

// elements
import CircularProgress from '@material-ui/core/CircularProgress';

import { useStyles } from './loader.styles';

/** Component public properties required to be provided by parent component. */
export interface ILoaderPropsExternalProps {
	size?: number;
}

type ILoaderProps = ILoaderPropsExternalProps;

function Loader({ size = 128 }: ILoaderProps) {
	const classes = useStyles();

	return (
		<div
			className={classes.root}
		>
			<CircularProgress size={size}/>
		</div>
	);
}

export default hot(module)(Loader);
