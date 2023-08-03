-- AlterTable
ALTER TABLE "users" ADD COLUMN     "blockedId" TEXT,
ADD COLUMN     "friendsId" TEXT;

-- CreateTable
CREATE TABLE "Contacts" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_friendsId_fkey" FOREIGN KEY ("friendsId") REFERENCES "Contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "Contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
