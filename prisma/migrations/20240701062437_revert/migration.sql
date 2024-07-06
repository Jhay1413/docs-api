/*
  Warnings:

  - You are about to drop the column `receivedById` on the `TransactionLogs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TransactionLogs" DROP COLUMN "receivedById",
ADD COLUMN     "receivedBy" TEXT;
