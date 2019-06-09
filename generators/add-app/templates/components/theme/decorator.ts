import { Store } from 'redux';

import { connectToInjector } from 'lib/di';
import {
	IAppThemesDescriptors,
} from 'theme';


export interface IThemeSelectorViewProps {
	items: IAppThemesDescriptors;
	bindToStore: (keys: (keyof IThemeState)[]) => IThemeState;
	update: (value: string) => void;
}

interface IThemeState {
	theme: string;
}

export const themeDIDecorator = connectToInjector<{}, IThemeSelectorViewProps>({
	items: {
		dependencies: ['theme:theme-descriptors:provider()'],
	},
	bindToStore: {
		dependencies: ['data-store:bind'],
	},
	update: {
		dependencies: ['ui:actions@setTheme'],
		value: (setTheme: (theme: string) => void) => Promise.resolve(setTheme),
	},
});
