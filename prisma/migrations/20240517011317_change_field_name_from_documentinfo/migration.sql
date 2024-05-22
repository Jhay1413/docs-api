/*
  Warnings:

  - You are about to drop the column `accountId` on the `DocumentInfo` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `DocumentInfo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DocumentInfo" DROP CONSTRAINT "DocumentInfo_accountId_fkey";

-- AlterTable
ALTER TABLE "DocumentInfo" DROP COLUMN "accountId",
ADD COLUMN     "createdBy" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "DocumentInfo" ADD CONSTRAINT "DocumentInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "UserAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
