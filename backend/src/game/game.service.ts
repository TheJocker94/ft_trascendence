import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { historyDto } from "./dto";

@Injectable()
export class GameService {
    constructor(private prisma: PrismaService) { }

    async createHistory(data: historyDto) {

        const match = await this.prisma.matchHistory.create(
            {
                data: {
                    User1Id: data.user1Id,
                    User2Id: data.user2Id,
                    winner: data.winnerId,
                    score: data.score,
                    mode: data.mode,
                }
            });
        return match;
    }
}