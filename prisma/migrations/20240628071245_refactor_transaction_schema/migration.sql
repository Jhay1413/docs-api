/*
  Warnings:

  - You are about to drop the column `historyId` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the `TransactionHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransactionInfo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `transactionId` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_historyId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionHistory" DROP CONSTRAINT "TransactionHistory_forwardedBy_fkey";

-- DropForeignKey
ALTER TABLE "TransactionHistory" DROP CONSTRAINT "TransactionHistory_parentRecordId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionHistory" DROP CONSTRAINT "TransactionHistory_receivedBy_fkey";

-- DropForeignKey
ALTER TABLE "TransactionInfo" DROP CONSTRAINT "TransactionInfo_companyId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionInfo" DROP CONSTRAINT "TransactionInfo_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "TransactionInfo" DROP CONSTRAINT "TransactionInfo_projectId_fkey";

-- AlterTable
ALTER TABLE "Attachment" DROP COLUMN "historyId",
ADD COLUMN     "transactionId" TEXT NOT NULL,
ADD COLUMN     "transactionLogsId" TEXT;

-- DropTable
DROP TABLE "TransactionHistory";

-- DropTable
DROP TABLE "TransactionInfo";

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "documentSubType" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "forwardedTo" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "receivedBy" TEXT,
    "forwardedBy" TEXT NOT NULL,
    "parentRecordId" TEXT NOT NULL,
    "dateForwarded" TIMESTAMP(3) NOT NULL,
    "dateReceived" TIMESTAMP(3),
    "fromDepartment" TEXT NOT NULL,
    "toDepartment" TEXT NOT NULL,
    "forwardedByRole" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionLogs" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "documentSubType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "team" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "project" TEXT NOT NULL,
    "forwardedTo" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "receivedBy" TEXT,
    "forwardedBy" TEXT NOT NULL,
    "dateForwarded" TEXT NOT NULL,
    "dateReceived" TEXT,
    "originDepartment" TEXT NOT NULL,
    "targetDepartment" TEXT NOT NULL,
    "forwardedByRole" TEXT NOT NULL,

    CONSTRAINT "TransactionLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transactionId_key" ON "Transaction"("transactionId");

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("transactionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_transactionLogsId_fkey" FOREIGN KEY ("transactionLogsId") REFERENCES "TransactionLogs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "UserAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "CompanyProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_forwardedBy_fkey" FOREIGN KEY ("forwardedBy") REFERENCES "UserAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_receivedBy_fkey" FOREIGN KEY ("receivedBy") REFERENCES "UserAccounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionLogs" ADD CONSTRAINT "TransactionLogs_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
