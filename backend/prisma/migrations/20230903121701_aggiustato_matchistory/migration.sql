-- DropForeignKey
ALTER TABLE "matchHistory" DROP CONSTRAINT "matchHistory_User1Id_fkey";

-- DropForeignKey
ALTER TABLE "matchHistory" DROP CONSTRAINT "matchHistory_User2Id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "matchHistory" INTEGER[];
