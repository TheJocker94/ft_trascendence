import { IsString, IsNotEmpty } from 'class-validator';

export class FriendDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    status?: string;
}

export class AddFriendDto {
    @IsNotEmpty()
    @IsString()
    friendId: string;
}

export class BlockedUserDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    username: string;
}