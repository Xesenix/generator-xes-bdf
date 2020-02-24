export interface IDependencyDescriptor {
	/**
	 * Dependency injection container key.
	 */
	key: string;
	/**
	 * Describes dependency tag to inject.
	 * Named dependencies use `key=named`.
	 */
	tag: {
		key: string;
		value: string;
	} | null;
	/**
	 * Request array of results. If false will throw error if multiple instances of requested dependency exist.
	 */
	multiple: boolean;
	/**
	 * Executes returned dependency and returns it result practical use for providers and factories.
	 */
	callable: boolean;
}
