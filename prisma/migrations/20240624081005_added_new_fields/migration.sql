/*
  Warnings:

  - You are about to drop the `DocumentHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DocumentInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_historyId_fkey";

-- DropForeignKey
ALTER TABLE "DocumentHistory" DROP CONSTRAINT "DocumentHistory_forwardedBy_fkey";

-- DropForeignKey
ALTER TABLE "DocumentHistory" DROP CONSTRAINT "DocumentHistory_parentRecordId_fkey";

-- DropForeignKey
ALTER TABLE "DocumentHistory" DROP CONSTRAINT "DocumentHistory_receivedBy_fkey";

-- DropForeignKey
ALTER TABLE "DocumentInfo" DROP CONSTRAINT "DocumentInfo_createdBy_fkey";

-- DropTable
DROP TABLE "DocumentHistory";

-- DropTable
DROP TABLE "DocumentInfo";

-- CreateTable
CREATE TABLE "TransactionInfo" (
    "id" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "documentSubType" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "TransactionInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionHistory" (
    "id" TEXT NOT NULL,
    "forwardedTo" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "receivedBy" TEXT,
    "forwardedBy" TEXT NOT NULL,
    "parentRecordId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateForwarded" TIMESTAMP(3) NOT NULL,
    "dateReceived" TIMESTAMP(3),
    "subject" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fromDepartment" TEXT NOT NULL,
    "toDepartment" TEXT NOT NULL,

    CONSTRAINT "TransactionHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransactionInfo" ADD CONSTRAINT "TransactionInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "UserAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionInfo" ADD CONSTRAINT "TransactionInfo_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_forwardedBy_fkey" FOREIGN KEY ("forwardedBy") REFERENCES "UserAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_parentRecordId_fkey" FOREIGN KEY ("parentRecordId") REFERENCES "TransactionInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_receivedBy_fkey" FOREIGN KEY ("receivedBy") REFERENCES "UserAccounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "TransactionHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
