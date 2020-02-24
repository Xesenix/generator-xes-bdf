import { injectable } from 'lib/di';

import { IUser } from './interfaces';

@injectable()
export class AclService {
	private rules: { [role: string]: { [resource: string]: string[] } } = {};

	public allow(role: string, resource: string, permissions: string) {
		if (!this.rules[role]) {
			this.rules[role] = {};
		}

		if (!this.rules[role][resource]) {
			this.rules[role][resource] = [];
		}

		this.rules[role][resource].push(permissions);
	}

	public async isAllowed(user: IUser, resource: string, permissions: string) {
		console.log('isAllowed', { user, resource, permissions, rules: this.rules });
		return user.roles.some((role: string) => !!this.rules[role] && !!this.rules[role][resource] && this.rules[role][resource].includes(permissions));
	}
}
