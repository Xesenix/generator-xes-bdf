import { connectToInjector } from 'lib/di';
import { IAppThemesDescriptors } from 'theme';

export interface IThemeSelectorViewProps {
	bindToStore: (keys: (keyof IThemeState)[]) => IThemeState;
	items: IAppThemesDescriptors;
	update: (value: string) => void;
}

interface IThemeState {
	theme: string;
}

export const themeDIDecorator = connectToInjector<{}, IThemeSelectorViewProps>({
	bindToStore: {
		dependencies: ['data-store:bind'],
	},
	items: {
		dependencies: ['theme:theme-descriptors:provider()'],
	},
	update: {
		dependencies: ['ui:actions@setTheme'],
		value: (setTheme: (theme: string) => void) => Promise.resolve(setTheme),
	},
});
