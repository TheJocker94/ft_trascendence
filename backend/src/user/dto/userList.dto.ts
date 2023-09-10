import { User } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsString, IsOptional, IsBoolean, IsNumber, IsEmail, IsArray } from 'class-validator';
import { FriendsDto } from './userSocial.dto';

export class userListDto {

    @Expose()
    @IsString()
    id: string;

    @Expose()
    @IsString()
    @IsOptional()
    username: string;

    @Expose()
    @IsString()
    @IsOptional()
    profilePicture?: string;

    @Expose()
    @IsNumber()
    @IsOptional()
    winrate?: number;

    @Expose()
    @IsNumber()
    Wins: number;

    @Expose()
    @IsNumber()
    Losses: number;

    @Expose()
    @IsNumber()
    Played: number;

    @Expose()
    @IsBoolean()
    @IsOptional()
    isOnline?: boolean;

    @Expose()
    @IsBoolean()
    @IsOptional()
    isPlaying?: boolean;
}


export class matchHistoryDto{
    @Expose()
    @IsString()
    user1Id: FriendsDto;

    @Expose()
    @IsString()
    user2Id: FriendsDto;

    @Expose()
    @IsString()
    winnerUsername: string;

    @Expose()
    @IsNumber()
    score: number;

    @Expose()
    @IsString()
    mode: string;
}