import { IDependencyDescriptor } from './interfaces';

const taggedRegexp = /\@([\\/a-zA-Z0-9_-]*)(=([\\/a-zA-Z0-9_-]+))?/;
const callRegexp = /(\(\))$/;
const multipleRegexp = /(\[\])/;

/**
 * Converst string dependency descriptor into full IDependencyDescriptor object.
 * String format is formatted as follows:
 * @examples
 * `key` - call get on DI container
 *
 * `key@named` - call getNamed on DI container
 *
 * `key@tagKey=tagValue` - call getTagged on DI container
 *
 * `key[]` - call getAll on DI container
 *
 * `key@named[]` - call getAllNamed on DI container
 *
 * `key@tagKey=tagValue[]` - call getAllTagged on DI container
 *
 * also if its ends with `()` it will call provider/factory function and return resolved value
 *
 * @param descriptor either string formated dependency description or partial IDependencyDescriptor object
 */
export function parseDependencyDescriptor(descriptor: string | Partial<IDependencyDescriptor>): IDependencyDescriptor {
	if (typeof descriptor === 'object') {
		return {
			tag: null,
			multiple: false,
			callable: false,
			...descriptor,
		} as IDependencyDescriptor;
	}

	let tagKey: string | null = null;
	let value: string | null = null;
	let key = descriptor as string;
	const taggedMatch = taggedRegexp.exec(key);
	const callMatch = callRegexp.exec(key);
	const multipleMatch = multipleRegexp.exec(key);

	if (!!callMatch) {
		key = key.replace(callMatch[0], '');
	}

	if (!!multipleMatch) {
		key = key.replace(multipleMatch[0], '');
	}

	if (!!taggedMatch) {
		key = key.replace(taggedMatch[0], '');
		tagKey = typeof taggedMatch[3] === 'string' ? taggedMatch[1] : 'named';
		value = typeof taggedMatch[3] === 'string' ? taggedMatch[3] : taggedMatch[1];
	}

	return {
		key,
		tag: typeof value === 'string' ? {
			key: tagKey,
			value,
		} : null,
		multiple: !!multipleMatch,
		callable: !!callMatch,
	} as IDependencyDescriptor;
}
