export interface IUser {
	id: string;
	roles: string[];
}

/** Inspired by @see https://www.npmjs.com/package/acl */
export interface IACLGuard {
	isAllowed: (user: IUser, resource: string, permissions: string | string[]) => Promise<boolean>;
}
