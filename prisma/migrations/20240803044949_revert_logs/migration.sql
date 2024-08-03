/*
  Warnings:

  - Made the column `receiver` on table `TransactionLogs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `receiverId` on table `TransactionLogs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TransactionLogs" ALTER COLUMN "receiver" SET NOT NULL,
ALTER COLUMN "receiverId" SET NOT NULL;
