export class ChannelDto {
    id: string;
    name: string;
    type: string;
    notInRoom: string[];
}

export class MessageDto {
    id: number;
    content: string;
    senderId:string;
    channelId: string;
    read: boolean;
    time: Date;
}

export class ChannelMembershipDto {
    userId: string;
    channelId: string;
    role: string;
    status: string;
	notRead: number;
}

export class SingleChannelDto {
    id: string;
    name: string;
    type: string;
    messages: MessageDto[];
    members: ChannelMembershipDto[];
}
