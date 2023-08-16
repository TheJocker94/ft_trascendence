export interface IFriend {
	id: number;
	username: number;
	isOnline: boolean;
	profilePicture: string;
}

export interface IFriendLists {
	friends: IFriend[];
	pendings: IFriend[];
	sent: IFriend[];
}