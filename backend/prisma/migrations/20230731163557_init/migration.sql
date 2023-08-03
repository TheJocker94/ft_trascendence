-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "hash" TEXT NOT NULL,
    "hashedRt" TEXT,
    "winrate" DOUBLE PRECISION,
    "Wins" INTEGER NOT NULL DEFAULT 0,
    "Losses" INTEGER NOT NULL DEFAULT 0,
    "Played" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
