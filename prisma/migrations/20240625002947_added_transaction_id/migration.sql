/*
  Warnings:

  - A unique constraint covering the columns `[transactionId]` on the table `TransactionInfo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionId` to the `TransactionInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TransactionInfo" ADD COLUMN     "transactionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TransactionInfo_transactionId_key" ON "TransactionInfo"("transactionId");
