export interface IChat{
    userID:string,
    username: string,
}
export interface INewMessage{
    sender: string,
    text: string,
    time: string,
    status: string
    myself: boolean;
}

export interface IChannel{
    id: string,
    name: string,
    messages: IMessage[],
    type: string,
    active?: boolean,
}

export interface IMessage{
    content: string,
    time: Date,
}