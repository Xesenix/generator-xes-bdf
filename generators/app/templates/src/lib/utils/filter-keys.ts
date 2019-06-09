import { pickBy } from 'lodash';

export const filterByKeys = <T extends object>(keys: (keyof T)[]) => (data: T): T => pickBy(data, (_, key: any) => keys.indexOf(key) >= 0) as T;
