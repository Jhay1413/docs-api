/*
  Warnings:

  - You are about to drop the column `email` on the `UserAccounts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `UserAccounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `UserAccounts` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UserAccounts_email_key";

-- AlterTable
ALTER TABLE "UserAccounts" DROP COLUMN "email",
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserAccounts_username_key" ON "UserAccounts"("username");
