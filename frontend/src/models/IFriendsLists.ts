export interface IFriend {
	id: string;
	username: string;
	isOnline: boolean;
	isPlaying: boolean;
	profilePicture: string;
}

export interface IFriendLists {
	friends: IFriend[];
	pendings: IFriend[];
	sent: IFriend[];
}