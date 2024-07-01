/*
  Warnings:

  - Added the required column `projectId` to the `TransactionInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TransactionInfo" ADD COLUMN     "projectId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TransactionInfo" ADD CONSTRAINT "TransactionInfo_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "CompanyProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
