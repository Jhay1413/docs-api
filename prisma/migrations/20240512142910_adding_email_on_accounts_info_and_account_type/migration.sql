/*
  Warnings:

  - You are about to drop the column `role` on the `UserAccounts` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `UserAccounts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `UserAccounts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserAccounts_username_key";

-- AlterTable
ALTER TABLE "UserAccounts" DROP COLUMN "role",
DROP COLUMN "username",
ADD COLUMN     "accountType" "Roles" NOT NULL DEFAULT 'USER',
ADD COLUMN     "email" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "UserAccounts_email_key" ON "UserAccounts"("email");
