import { MatchMode } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";


export class historyDto {
    @IsNotEmpty()
    @IsString()
    user1Id: string;

    @IsNotEmpty()
    @IsString()
    user2Id: string;

    @IsNotEmpty()
    @IsString()
    winnerId: string;

    @IsNotEmpty()
    @IsString()
    score: string;

    @IsNotEmpty()
    mode: MatchMode;
}