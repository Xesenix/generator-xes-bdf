import { IUIState as IBaseState } from 'lib/ui';

export interface IUIState extends IBaseState {
	drawerOpen: boolean;
}
