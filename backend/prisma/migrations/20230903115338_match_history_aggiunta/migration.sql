-- CreateEnum
CREATE TYPE "MatchMode" AS ENUM ('CLASSIC', 'POWERUP');

-- CreateTable
CREATE TABLE "matchHistory" (
    "id" SERIAL NOT NULL,
    "User1Id" TEXT NOT NULL,
    "User2Id" TEXT NOT NULL,
    "winner" TEXT NOT NULL,
    "score" TEXT NOT NULL,
    "mode" "MatchMode" NOT NULL,

    CONSTRAINT "matchHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "matchHistory" ADD CONSTRAINT "matchHistory_User1Id_fkey" FOREIGN KEY ("User1Id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matchHistory" ADD CONSTRAINT "matchHistory_User2Id_fkey" FOREIGN KEY ("User2Id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
