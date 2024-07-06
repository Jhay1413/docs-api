/*
  Warnings:

  - You are about to drop the column `receivedBy` on the `TransactionLogs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TransactionLogs" DROP COLUMN "receivedBy",
ADD COLUMN     "receivedById" TEXT;
