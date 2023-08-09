/*
  Warnings:

  - You are about to drop the column `blockedId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `friendsId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `Contacts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_blockedId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_friendsId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "blockedId",
DROP COLUMN "friendsId",
DROP COLUMN "isAdmin",
ADD COLUMN     "blocked_by_id" TEXT,
ADD COLUMN     "blocking_id" TEXT,
ADD COLUMN     "friends_id" TEXT,
ADD COLUMN     "profilePicture" TEXT DEFAULT 'path_to_default_pic.jpg',
ALTER COLUMN "winrate" SET DEFAULT 0;

-- DropTable
DROP TABLE "Contacts";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_friends_id_fkey" FOREIGN KEY ("friends_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_blocked_by_id_fkey" FOREIGN KEY ("blocked_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_blocking_id_fkey" FOREIGN KEY ("blocking_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
