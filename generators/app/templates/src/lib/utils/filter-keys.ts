import pickBy from 'lodash-es/pickBy';

export const filterByKeys = <T extends object>(keys: (keyof T)[]) => (data: T): T => pickBy(data, (_, key: any) => keys.indexOf(key) >= 0) as T;
