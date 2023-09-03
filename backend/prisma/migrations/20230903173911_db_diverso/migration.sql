/*
  Warnings:

  - The values [GROUP] on the enum `ChannelType` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Channel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ChannelMembership` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChannelType_new" AS ENUM ('PUBLIC', 'PRIVATE', 'DIRECT');
ALTER TABLE "Channel" ALTER COLUMN "type" TYPE "ChannelType_new" USING ("type"::text::"ChannelType_new");
ALTER TYPE "ChannelType" RENAME TO "ChannelType_old";
ALTER TYPE "ChannelType_new" RENAME TO "ChannelType";
DROP TYPE "ChannelType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "ChannelMembership" DROP CONSTRAINT "ChannelMembership_channelId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_channelId_fkey";

-- AlterTable
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Channel_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Channel_id_seq";

-- AlterTable
ALTER TABLE "ChannelMembership" DROP CONSTRAINT "ChannelMembership_pkey",
ALTER COLUMN "channelId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ChannelMembership_pkey" PRIMARY KEY ("userId", "channelId");

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "channelId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "ChannelMembership" ADD CONSTRAINT "ChannelMembership_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
