-- DropForeignKey
ALTER TABLE "DocumentHistory" DROP CONSTRAINT "DocumentHistory_receivedBy_fkey";

-- DropIndex
DROP INDEX "DocumentInfo_accountId_key";

-- AlterTable
ALTER TABLE "DocumentHistory" ALTER COLUMN "receivedBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DocumentHistory" ADD CONSTRAINT "DocumentHistory_receivedBy_fkey" FOREIGN KEY ("receivedBy") REFERENCES "UserAccounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
