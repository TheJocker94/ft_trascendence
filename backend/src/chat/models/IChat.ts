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
