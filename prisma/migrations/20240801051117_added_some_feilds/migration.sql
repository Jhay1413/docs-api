/*
  Warnings:

  - You are about to drop the column `receivedBy` on the `TransactionLogs` table. All the data in the column will be lost.
  - Added the required column `receiverId` to the `TransactionLogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TransactionLogs" DROP COLUMN "receivedBy",
ADD COLUMN     "receiverId" TEXT NOT NULL;
