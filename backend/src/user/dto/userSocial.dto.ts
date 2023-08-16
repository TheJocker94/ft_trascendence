import { IsString, IsNotEmpty } from 'class-validator';

export class AddFriendDto {
    @IsNotEmpty()
    @IsString()
    friendId: string;
}

export class FriendsDto {
    id: string;
    username: string;
    profilePicture: string;
    isOnline: boolean;
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
}

export class removeBlockedDto {
    @IsNotEmpty()
    @IsString()
    userIdToUnblock: string;
}
