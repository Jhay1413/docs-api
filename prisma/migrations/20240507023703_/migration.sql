/*
  Warnings:

  - You are about to drop the column `forwarededFrom` on the `DocumentHistory` table. All the data in the column will be lost.
  - You are about to drop the column `recievedBy` on the `DocumentHistory` table. All the data in the column will be lost.
  - You are about to drop the column `attachment` on the `DocumentInfo` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `DocumentInfo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[receivedBy]` on the table `DocumentHistory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountId]` on the table `DocumentInfo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `forwardedFrom` to the `DocumentHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receivedBy` to the `DocumentHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountId` to the `DocumentInfo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DocumentHistory" DROP CONSTRAINT "DocumentHistory_recievedBy_fkey";

-- DropForeignKey
ALTER TABLE "DocumentInfo" DROP CONSTRAINT "DocumentInfo_createdBy_fkey";

-- DropIndex
DROP INDEX "DocumentHistory_recievedBy_key";

-- DropIndex
DROP INDEX "DocumentInfo_createdBy_key";

-- AlterTable
ALTER TABLE "DocumentHistory" DROP COLUMN "forwarededFrom",
DROP COLUMN "recievedBy",
ADD COLUMN     "forwardedFrom" TEXT NOT NULL,
ADD COLUMN     "receivedBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DocumentInfo" DROP COLUMN "attachment",
DROP COLUMN "createdBy",
ADD COLUMN     "accountId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DocumentHistory_receivedBy_key" ON "DocumentHistory"("receivedBy");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentInfo_accountId_key" ON "DocumentInfo"("accountId");

-- AddForeignKey
ALTER TABLE "DocumentInfo" ADD CONSTRAINT "DocumentInfo_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "UserAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentHistory" ADD CONSTRAINT "DocumentHistory_receivedBy_fkey" FOREIGN KEY ("receivedBy") REFERENCES "UserAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
