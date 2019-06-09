import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export function ConfigLink<T>(props: T) {
	return <RouterLink to="/config" {...props}/>;
}

export function GameLink<T>(props: T) {
	return <RouterLink to="/game" {...props}/>;
}

export function IntroLink<T>(props: T) {
	return <RouterLink to="/" {...props}/>;
}
