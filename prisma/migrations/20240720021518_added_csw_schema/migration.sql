/*
  Warnings:

  - You are about to drop the `TransactionLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionLog" DROP CONSTRAINT "TransactionLog_createdById_fkey";

-- DropForeignKey
ALTER TABLE "TransactionLog" DROP CONSTRAINT "TransactionLog_transactionId_fkey";

-- DropTable
DROP TABLE "TransactionLog";

-- CreateTable
CREATE TABLE "CompleteStaffWork" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT NOT NULL,
    "attachment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompleteStaffWork_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("transactionId") ON DELETE CASCADE ON UPDATE CASCADE;
