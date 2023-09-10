import { IsString, IsNotEmpty } from 'class-validator';

export class AddFriendDto {
    @IsNotEmpty()
    @IsString()
    friendId: string;
}

export class InviteGameDto {
    @IsNotEmpty()
    @IsString()
    gameId: string;
}

export class FriendsDto {
    id: string;
    username: string;
    profilePicture: string;
    isOnline: boolean;
    isPlaying: boolean;
}

export class InviteFriendsDto {
	id: string;
	username: string;
	profilePicture: string;
	isOnline: boolean;
    isPlaying: boolean;
}

export class InvitedProfileDto {
	gameId: string;
    id: string;
	username: string;
	profilePicture: string;
	isOnline: boolean;
    isPlaying: boolean;
}

export class blockUserDto {
    @IsNotEmpty()
    @IsString()
    blockedId: string;
}

export class BlockedUserResponseDto {
    id: string;
    username: string;
    profilePicture: string;
	isOnline: boolean;
    isPlaying: boolean;
}

export class removeBlockedDto {
    @IsNotEmpty()
    @IsString()
    userIdToUnblock: string;
}
