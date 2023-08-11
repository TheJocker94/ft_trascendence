import { IsString, IsNotEmpty } from 'class-validator';

export class AddFriendDto {
    @IsNotEmpty()
    @IsString()
    friendId: string;
}

export class FriendsDto {
    id: string;
    username: string;
    email: string;
    profilePicture: string;
}

export class blockUserDto {
    @IsNotEmpty()
    @IsString()
    blockedId: string;
}

export class BlockedUserDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    username: string;
}

export class BlockedUserResponseDto {
    id: string;
    username: string;
    email: string;
    profilePicture: string;
}

export class removeBlockedDto {
    @IsNotEmpty()
    @IsString()
    userIdToUnblock: string;
}
