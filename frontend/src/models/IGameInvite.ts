export interface IGInvite {
	id: string;
	username: string;
	isOnline: boolean;
	profilePicture: string;
}

export interface IGInviteLists {
	friends: IGInvite[];
	pendings: IGInvite[];
	sent: IGInvite[];
}