export interface IChat{
    userID:string,
    username: string,
}
export interface INewMessage{
    sender: string,
    text: string,
    time: string,
    status: string
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

export interface ISender{
    id: string,
    username: string,
    profilePicture: string,
    isOnline: boolean,
}
export interface IMessageChannel{
    content: string,
    read: boolean,
    time: Date,
    sender: ISender,
}

export interface IMember{
    userId: string,
    role: string,   
    status: string,
    muteEndTime: Date,
}

export interface ISingleCh{
    id: string,
    type: string,
    name: string,
    password: string,
    messages: IMessageChannel[],
    members: IMember[],
}