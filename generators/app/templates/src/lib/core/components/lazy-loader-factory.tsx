import * as React from 'react';

export default function LazyLoaderFactory<T = any>(
	promise: () => Promise<{ default: React.ComponentType<any> }>,
	Loader = () => <>Loading...</>,
	RetryView = ({ retry }) => <button onClick={retry}>Module loading error. Try again.</button>,
) {
	function LazyLoader(props: T) {
		const [ loading, setLoading ] = React.useState<boolean>(true);

		const retry = React.useCallback(() => setLoading(true), []);

		const Lazy = React.useMemo(() => React.lazy(() => promise().catch(() => {
			setLoading(false);
			return { default: () => <RetryView retry={retry}/> };
		})), [promise, loading]);

		return <React.Suspense fallback={<Loader/>}><Lazy {...props}/></React.Suspense>;
	}

	(LazyLoader as any).displayName = `LazyLoader`;

	return LazyLoader as React.ComponentType<T>;
}
