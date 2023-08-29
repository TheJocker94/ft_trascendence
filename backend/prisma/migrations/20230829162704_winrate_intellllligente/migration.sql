/*
  Warnings:

  - You are about to drop the column `winrate` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "winrate",
ADD COLUMN     "Wins / Played * 100" DOUBLE PRECISION NOT NULL DEFAULT 0;
