/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Channel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_ownerId_fkey";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "ownerId";

-- CreateIndex
CREATE UNIQUE INDEX "Channel_id_key" ON "Channel"("id");
