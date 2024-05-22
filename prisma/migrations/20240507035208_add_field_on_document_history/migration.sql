/*
  Warnings:

  - You are about to drop the column `documentId` on the `DocumentHistory` table. All the data in the column will be lost.
  - Added the required column `department` to the `DocumentHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forwardedBy` to the `DocumentHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentRecordId` to the `DocumentHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DocumentHistory" DROP CONSTRAINT "DocumentHistory_documentId_fkey";

-- DropIndex
DROP INDEX "DocumentHistory_receivedBy_key";

-- AlterTable
ALTER TABLE "DocumentHistory" DROP COLUMN "documentId",
ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "forwardedBy" TEXT NOT NULL,
ADD COLUMN     "parentRecordId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "DocumentHistory" ADD CONSTRAINT "DocumentHistory_forwardedBy_fkey" FOREIGN KEY ("forwardedBy") REFERENCES "UserAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentHistory" ADD CONSTRAINT "DocumentHistory_parentRecordId_fkey" FOREIGN KEY ("parentRecordId") REFERENCES "DocumentInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
