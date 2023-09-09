import { Expose } from 'class-transformer';
import { IsString, IsOptional, IsBoolean, IsNumber, IsEmail, IsArray } from 'class-validator';

export class UserDto {

    @Expose()
    @IsString()
    id: string;

    @Expose()
    @IsString()
    @IsOptional()
    username: string;

    @Expose()
    @IsEmail()
    email: string;

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

    @Expose()
    @IsArray()
    friendsId: string[];

    @Expose()
    @IsArray()
    blockedById: string[];

    @Expose()
    @IsArray()
    blockedId: string[];
}
