import * as inversify from 'inversify';

export interface IBasicInjection {
	type: inversify.interfaces.ServiceIdentifier<any>;
}

export interface INamedInjection extends IBasicInjection {
	named: string;
}

export interface ITaggedInjection extends IBasicInjection {
	tagged: { key: string, value: string };
}

export type Injection = (
	inversify.interfaces.ServiceIdentifier<any> |
	IBasicInjection |
	INamedInjection |
	ITaggedInjection
);
