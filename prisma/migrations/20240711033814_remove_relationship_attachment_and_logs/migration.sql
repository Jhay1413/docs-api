/*
  Warnings:

  - You are about to drop the column `transactionLogsId` on the `Attachment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_transactionLogsId_fkey";

-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "transactionLogsId";

-- AlterTable
ALTER TABLE "TransactionLogs" ADD COLUMN     "attachments" TEXT NOT NULL DEFAULT '';
