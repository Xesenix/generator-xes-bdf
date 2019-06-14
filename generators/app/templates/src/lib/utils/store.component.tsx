import { isEqual } from 'lodash';
import * as React from 'react';
import { Store } from 'redux';

import { filterByKeys } from './filter-keys';

export interface IStoreComponentInternalProps<S> {
	store: Store<S>;
}

export const diStoreComponentDependencies = {
	store: {
		dependencies: ['data-store'],
	},
};

/**
 * Base react component updating when any of provided store keys updates.
 */
export abstract class StoreComponent<P extends IStoreComponentInternalProps<S>, S extends object, SS = any> extends React.Component<P, S, SS> {
	protected unsubscribeDataStore?: any;

	protected filter: (data: S) => S;

	/**
	 *
	 * @param props component properties
	 * @param filters array of keys used to determin if component should be updated
	 *   doubles as list of properties that will get pooled out of data store into
	 *   component internal state
	 */
	constructor(props: P, filters: (keyof S)[]) {
		super(props);

		this.filter = filterByKeys<S>(filters);
		this.state = this.filter(props.store.getState());
	}

	public componentDidMount(): void {
		this.bindToStore();
	}

	public componentDidUpdate(): void {
		this.bindToStore();
	}

	public shouldComponentUpdate(nextProps: P, nextState: S): boolean {
		return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
	}

	public componentWillUnmount(): void {
		if (this.unsubscribeDataStore) {
			this.unsubscribeDataStore();
			this.unsubscribeDataStore = null;
		}
	}

	/**
	 * Responsible for notifying component about state changes related to this component.
	 * If global state changes for keys defined in this component state it will transfer global state to components internal state.
	 */
	protected bindToStore(): void {
		const { store } = this.props;

		if (!this.unsubscribeDataStore && !!store) {
			this.unsubscribeDataStore = store.subscribe(() => {
				if (!!this.unsubscribeDataStore && !!store) {
					this.setState(this.filter(store.getState()));
				}
			});
			this.setState(this.filter(store.getState()));
		}
	}
}

