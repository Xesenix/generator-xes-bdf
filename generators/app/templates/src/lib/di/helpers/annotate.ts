import {
	decorate,
	inject,
	injectable,
	interfaces,
	named,
	tagged,
} from 'inversify';
import * as helperInterfaces from './interfaces';

function annotate<T>(
	constructor: interfaces.Newable<T>,
	dependencies: helperInterfaces.Injection[] = [],
): void {

	decorate(injectable(), constructor);

	(dependencies).forEach((injection: helperInterfaces.Injection, index: number) => {
		if ((injection as helperInterfaces.IBasicInjection).type === undefined) {

			// Add inject metadata
			decorate(
				inject(
					(injection as interfaces.ServiceIdentifier<T>),
				) as any,
				constructor,
				index,
			);

		} else {

			// Add inject metadata
			decorate(
				inject(
					(injection as helperInterfaces.IBasicInjection).type,
				) as any,
				constructor,
				index,
			);

			// Add named metadata
			if ((injection as helperInterfaces.INamedInjection).named !== undefined) {

				decorate(
					named(
						(injection as helperInterfaces.INamedInjection).named,
					) as any,
					constructor,
					index,
				);
			}

			// Add tagged metadata
			if ((injection as helperInterfaces.ITaggedInjection).tagged !== undefined) {
				decorate(
					tagged(
						(injection as helperInterfaces.ITaggedInjection).tagged.key,
						(injection as helperInterfaces.ITaggedInjection).tagged.value,
					) as any,
					constructor,
					index,
				);
			}
		}
	});
}

export { annotate };
