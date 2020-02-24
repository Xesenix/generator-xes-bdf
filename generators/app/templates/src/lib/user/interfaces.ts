export interface IUser {
	id?: string;
	roles: string[];
}

export interface IUserState {
	user: IUser | null;
	authenticationError: any;
}
