-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailVerificationCode" TEXT,
ADD COLUMN     "is2faEnabled" BOOLEAN NOT NULL DEFAULT false;
