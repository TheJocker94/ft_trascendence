import { Expose } from 'class-transformer';
import { IsString, IsOptional, IsBoolean, IsNumber, IsEmail, IsArray } from 'class-validator';

export class userUpdateNameDto {

    @Expose()
    @IsString()
    @IsOptional()
    id?: string

    @Expose()
    @IsString()
    newUsername: string;
}

export class userUpdateMailDto {

    @Expose()
    @IsString()
    @IsOptional()
    id?: string;

    @Expose()
    @IsString()
    @IsEmail()
    newEmail: string;
}

export class userUpdateImageDto {

    @Expose()
    @IsString()
    @IsOptional()
    id?: string;

    @Expose()
    @IsString()
    newImage: string;
}