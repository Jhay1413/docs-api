/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `UserAccounts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserAccounts" ALTER COLUMN "email" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "UserAccounts_email_key" ON "UserAccounts"("email");
