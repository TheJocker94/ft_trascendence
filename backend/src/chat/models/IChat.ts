import exp from "constants";

export interface IGroup{
    id: number;
	name: string;
	owner: string;
	type: string;
	password?: string;
	members: string[];
	messages: IMessage[];
}

export interface IMessage{
	id: number;
	senderId: string;
	content: string;
	time: Date;
}

export interface IMuted{
	id: string;
	time: Date;
}
