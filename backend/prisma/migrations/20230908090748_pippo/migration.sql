-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "notInRoom" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "ChannelMembership" ADD COLUMN     "notRead" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Gameinvite" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "FriendshipStatus" NOT NULL,

    CONSTRAINT "Gameinvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Gameinvite_senderId_receiverId_key" ON "Gameinvite"("senderId", "receiverId");

-- AddForeignKey
ALTER TABLE "Gameinvite" ADD CONSTRAINT "Gameinvite_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gameinvite" ADD CONSTRAINT "Gameinvite_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
